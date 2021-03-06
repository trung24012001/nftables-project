import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { RuleType, request, routes } from "lib";
import { useFetchData } from "lib/hooks";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "store";
import { getRuleset, setMessage } from "store/reducers";
import { natHeaders } from "./header";

export function NatTable(): React.ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { data, loading, refetch } = useFetchData<{ ruleset: RuleType[] }>({
    path: '/rules',
    config: {
      params: {
        type: 'nat',
        chain: params.get("chain"),
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleAdd = () => {
    navigate(routes.ADD_NAT_ROUTE);
  };

  const handleDelete = async (rule: any) => {
    try {
      const res = await request.delete("/rules", {
        params: {
          rule,
        },
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
      dispatch(
        setMessage({
          content: "Delete rule error",
          type: "error",
        })
      );
    }
  };

  const handleSelctRow = (row: RuleType) => {
    navigate({
      pathname: routes.NAT_DETAIL_ROUTE,
      search: `?rule=${encodeURIComponent(JSON.stringify(row))}`
    })
  }

  return (
    <Background title="Nat Ruleset">
      <ReactTable
        headers={natHeaders}
        rows={data?.ruleset}
        onActionAdd={handleAdd}
        onActionRow={handleSelctRow}
        onActionDelete={handleDelete}
        loading={loading}
      />
    </Background>
  );
}
