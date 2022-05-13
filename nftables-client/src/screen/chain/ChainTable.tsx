import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { ChainType, request, routes } from "lib";
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
    navigate(routes.ADD_CHAIN_ROUTE);
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
    navigate({
      pathname: row.type === 'filter' ? routes.FIREWALL_ROUTE : routes.NAT_ROUTE,
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
