import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { ChainType, request } from "lib";
import { useFetchData } from "lib/hooks";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setMessage } from "store/reducers";
import { headers } from "./header";

export function ChainTable(): React.ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    console.log(params.get('table'))
  }, [params])

  const { data, loading, refetch } = useFetchData<{ chains: ChainType[] }>({
    path: '/chains',
    config: {
      params: {
        table: params.get("table"),
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleAdd = () => {
    navigate("/chains/add");
  };

  const handleDelete = async (chain: ChainType) => {
    try {
      console.log(chain)
      const res = await request.delete("/chains", {
        params: {
          chain
        }
      });
      if (res.status === 200) {
        dispatch(
          setMessage({
            content: res.data.message,
            type: "success",
          })
        );
        refetch()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectRow = (row: ChainType) => {
    console.log(row)
    navigate({
      pathname: '/rules/' + row.type,
      search: `?chain=${encodeURIComponent(JSON.stringify(row))}`
    })
  }

  return (
    <Background title="Chains">
      <ReactTable
        headers={headers}
        rows={data?.chains}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
        onActionRow={handleSelectRow}
        loading={loading}
      />
    </Background>
  );
}
