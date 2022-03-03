import { Box, Button, Link as MuiLink } from "@mui/material";
import type { NextPage } from "next";
import { NextLinkComposed } from "../components/UIElements/NextLinkButton";

const Home: NextPage = () => {
  return (
    <div>
      <Box
        sx={{
          m: 24,
        }}
      >
        <Box>
          <MuiLink component={NextLinkComposed} href="/events">
            Muilic
          </MuiLink>
        </Box>
        <Button href="/events" LinkComponent={NextLinkComposed}>
          link
        </Button>
      </Box>
    </div>
  );
};

export default Home;
