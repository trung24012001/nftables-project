import { Box } from "@mui/material";
import Background from "components/Layout/Background";
import { ReactTable } from "components/ReactTable";
import { ChainType, request } from "lib";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { getChains, setMessage } from "store/reducers";
import { headers } from "./header";

export function ChainTable(): React.ReactElement {
  const chains = useSelector((state: RootState) => state.ruleset.chains);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getChains({}));
  }, []);
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
      }
      dispatch(getChains({}));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectRow = () => {
    console.log('hello')
  }

  return (
    <Background title="Chains">
      <ReactTable
        headers={headers}
        rows={chains}
        onActionAdd={handleAdd}
        onActionDelete={handleDelete}
        onActionRow={handleSelectRow}
      />
    </Background>
  );
}
