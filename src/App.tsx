import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import { TabsComponent } from "./components";

export default () => {
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <TabsComponent />
        </Box>
      </Container>
      <Global
        styles={{
          body: {
            background: "#675d5d",
          },
        }}
      />
    </>
  );
};
