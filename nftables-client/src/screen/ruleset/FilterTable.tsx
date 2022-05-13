import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { RuleType, request, routes } from "lib";
import { useFetchData } from "lib/hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setMessage } from "store/reducers";
import { firewallHeaders } from "./header";

export function FirewallTable(): React.ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { data, loading, refetch } = useFetchData<{ ruleset: RuleType[] }>({
    path: '/rules',
    config: {
      params: {
        type: 'filter',
        chain: params.get("chain"),
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleAdd = () => {
    navigate(routes.ADD_FIREWALL_ROUTE);
  };

  const handleDelete = async (rule: RuleType) => {
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
      pathname: routes.FIREWALL_DETAIL_ROUTE,
      search: `?rule=${encodeURIComponent(JSON.stringify(row))}`
    })
  }

  return (
    <Background title="Firewall Ruleset">
      <ReactTable
        headers={firewallHeaders}
        rows={data?.ruleset}
        onActionAdd={handleAdd}
        onActionRow={handleSelctRow}
        onActionDelete={handleDelete}
        loading={loading}
      />
    </Background>
  );
}
