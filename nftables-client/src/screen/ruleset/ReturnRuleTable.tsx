import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { RuleType, request } from "lib";
import { useFetchData } from "lib/hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getRuleset, setMessage } from "store/reducers";
import { returnHeaders } from "./header";

export function ReturnRuleTable(): React.ReactElement {
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  const { data, loading } = useFetchData<{ ruleset: RuleType[] }>({
    path: '/rules',
    config: {
      params: {
        type: 'return',
        chain: params.get("chain"),
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })
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
        dispatch(getRuleset({ type: "return" }));
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

  return (
    <Background title="Return Rule">
      <ReactTable
        headers={returnHeaders}
        rows={data?.ruleset}
        onActionDelete={handleDelete}
        loading={loading}
      />
    </Background>
  );
}
