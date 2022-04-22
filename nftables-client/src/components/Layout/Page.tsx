import { Paper, PaperProps, Stack, styled, Typography } from "@mui/material";
import React from "react";

type PageProps = {
  title?: string;
  leftHeader?: React.ReactNode;
} & PaperProps;

const Page: React.VFC<PageProps> = ({
  children,
  title,
  leftHeader,
  ...paperProps
}) => {
  return (
    <PageStyle elevation={1} {...paperProps}>
      {title && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={{ md: 6 }}
        >
          <Typography
            variant="h4"
            sx={(theme) => ({ color: theme.palette.primary.main })}
          >
            {title}
          </Typography>
          {leftHeader}
        </Stack>
      )}
      {children}
    </PageStyle>
  );
};

const PageStyle = styled(Paper)(({ theme }) => ({
  padding: "24px",
  margin: "auto",
  position: "relative",
  height: "100%",
  width: "100%",
  borderRadius: "16px",
}));

export { Page };
