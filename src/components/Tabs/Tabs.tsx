import ContentCopy from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";

const CustomTabPanel: React.FC<{
  children: React.ReactNode;
  value: number;
  index: number;
}> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": { backgroundColor: "#222B38" },
});
const StyledTab = styled(Tab)({ textTransform: "none", fontWeight: "bold" });

function a11yProps(index: number) {
  return { id: `tab-${index}`, "aria-controls": `tabpanel-${index}` };
}

const InteractiveListItem = styled(ListItem)({
  transition: "background-color 300ms",
  "&:hover": { backgroundColor: "#f4f4f4", cursor: "pointer" },
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: "#dedede",
    color: "black",
  },
  borderRadius: "20px",
});

const ButtonWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
});

export const TabsComponent: React.FC = () => {
  const [value, setValue] = useState(0);

  const [roshanTime, setRoshanTime] = useState("");
  const [glyphTime, setGlyphTime] = useState("");

  const [calculatedTimes, setCalculatedTimes] = useState<{
    early?: string;
    latest?: string;
    glyph?: string;
  }>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [roshanError, setRoshanError] = useState(false);
  const [glyphError, setGlyphError] = useState(false);
  const [roshanErrorMessage, setRoshanErrorMessage] = useState("");
  const [glyphErrorMessage, setGlyphErrorMessage] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    setValue(newValue);

  const handleRoshanTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRoshanTime(event.target.value);
    if (roshanError) {
      setRoshanError(false);
      setRoshanErrorMessage("");
    }
  };

  const handleGlyphTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGlyphTime(event.target.value);
    if (glyphError) {
      setGlyphError(false);
      setGlyphErrorMessage("");
    }
  };

  const calculateRoshanTimes = (): void => {
    if (!validateTimeInput(roshanTime, setRoshanError, setRoshanErrorMessage)) {
      console.error("Roshan Validation failed. Correct your input.");
      return;
    }

    let strValue = roshanTime.toString();

    let normalizedTime = strValue
      .replace(/(\d{2})(\d{2})$/, "$1:$2")
      .replace(/(\d+)\.(\d+)/, "$1:$2")
      .replace(/\s/, ":");

    let [minutes, seconds] = normalizedTime
      .split(":")
      .map((num) => parseInt(num, 10));

    setCalculatedTimes({
      early: `${minutes + 8}:${seconds.toString().padStart(2, "0")}`,
      latest: `${minutes + 11}:${seconds.toString().padStart(2, "0")}`,
      glyph: calculatedTimes.glyph,
    });
  };

  const calculateGlyphTime = () => {
    if (!validateTimeInput(glyphTime, setGlyphError, setGlyphErrorMessage)) {
      console.error("Glyph Validation failed. Correct your input.");
      return;
    }

    let strValue = glyphTime.toString();

    let normalizedTime = strValue
      .replace(/(\d{2})(\d{2})$/, "$1:$2")
      .replace(/(\d+)\.(\d+)/, "$1:$2")
      .replace(/\s/, ":");

    let [minutes, seconds] = normalizedTime
      .split(":")
      .map((num) => parseInt(num, 10));

    setCalculatedTimes({
      early: calculatedTimes.early,
      latest: calculatedTimes.latest,
      glyph: `${minutes + 5}:${seconds.toString().padStart(2, "0")}`,
    });
  };

  const validateTimeInput = (
    input: any,
    setError: any,
    setErrorMessage: any
  ) => {
    if (!input.trim()) {
      setError(true);
      setErrorMessage("Field cannot be empty.");
      return false;
    }

    const isValidFormat = /^(1[0-1][0-9]|[0-9]{1,2})[0-5]\d$/.test(input);

    if (!isValidFormat) {
      setError(true);
      setErrorMessage("Enter a valid time (MMSS).");
      return false;
    }

    setError(false);
    setErrorMessage("");
    return true;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSelectedItem(text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          setSelectedItem(null);
        }, 1000);
      })
      .catch(console.error);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          bottom: 16, // Position it 16px above the bottom of the Paper
          left: "50%", // Center it horizontally
          transform: "translateX(-50%)", // Adjust for exact centering
          transition: "opacity 0.5s, visibility 0.5s",
          opacity: isCopied ? 1 : 0,
          visibility: isCopied ? "visible" : "hidden",
          zIndex: 1000, // Ensure it's above all other content
        }}
      >
        <Alert severity="success" sx={{ margin: 2 }}>
          Text copied to clipboard!
        </Alert>
      </Box>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <StyledTab label="Roshan" {...a11yProps(0)} />
        <StyledTab label="Glyph" {...a11yProps(1)} />
      </StyledTabs>
      <CustomTabPanel value={value} index={0}>
        <TextField
          fullWidth
          type="number"
          label="Current timer"
          helperText={
            roshanError ? roshanErrorMessage : "Format: MMSS | Example: 4412"
          }
          error={roshanError}
          variant="outlined"
          value={roshanTime}
          onChange={handleRoshanTimeChange}
          FormHelperTextProps={{ style: { marginLeft: "2px" } }}
        />
        <ButtonWrapper>
          <Button
            variant="contained"
            onClick={calculateRoshanTimes}
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Calculate Roshan
          </Button>
        </ButtonWrapper>
        <List sx={{ marginTop: 2 }}>
          {calculatedTimes.early && (
            <Tooltip title="Copy">
              <InteractiveListItem
                onClick={() =>
                  copyToClipboard(`Early time: ${calculatedTimes.early}`)
                }
                selected={
                  selectedItem === `Early time: ${calculatedTimes.early}`
                }
              >
                <ListItemText
                  primary="Earliest respawn time"
                  secondary={calculatedTimes.early}
                />
                <ContentCopy />
              </InteractiveListItem>
            </Tooltip>
          )}
          {calculatedTimes.latest && (
            <Tooltip title="Copy">
              <InteractiveListItem
                onClick={() =>
                  copyToClipboard(`Latest time: ${calculatedTimes.latest}`)
                }
                selected={
                  selectedItem === `Latest time: ${calculatedTimes.latest}`
                }
              >
                <ListItemText
                  primary="Latest respawn time"
                  secondary={calculatedTimes.latest}
                />
                <ContentCopy />
              </InteractiveListItem>
            </Tooltip>
          )}
          {calculatedTimes.early && calculatedTimes.latest && (
            <Tooltip title="Copy">
              <InteractiveListItem
                onClick={() =>
                  copyToClipboard(
                    `Rosh respawn: ${calculatedTimes.early}-${calculatedTimes.latest}`
                  )
                }
                selected={
                  selectedItem ===
                  `Rosh respawn: ${calculatedTimes.early}-${calculatedTimes.latest}`
                }
              >
                <ListItemText
                  primary="Respawn range"
                  secondary={`${calculatedTimes.early} - ${calculatedTimes.latest}`}
                />
                <ContentCopy />
              </InteractiveListItem>
            </Tooltip>
          )}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TextField
          fullWidth
          type="number"
          label="Current timer"
          helperText={
            glyphError ? glyphErrorMessage : "Format: MMSS | Example: 4412"
          }
          error={glyphError}
          variant="outlined"
          value={glyphTime}
          onChange={handleGlyphTimeChange}
          FormHelperTextProps={{ style: { marginLeft: "2px" } }}
        />
        <ButtonWrapper>
          <Button
            variant="contained"
            onClick={calculateGlyphTime}
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Calculate Glyph
          </Button>
        </ButtonWrapper>
        {calculatedTimes.glyph && (
          <List sx={{ marginTop: 2 }}>
            <Tooltip title="Copy">
              <InteractiveListItem
                onClick={() =>
                  copyToClipboard(`Glyph time: ${calculatedTimes.glyph}`)
                }
                selected={
                  selectedItem === `Glyph time: ${calculatedTimes.glyph}`
                }
              >
                <ListItemText
                  primary="Glyph time"
                  secondary={calculatedTimes.glyph}
                />
                <ContentCopy />
              </InteractiveListItem>
            </Tooltip>
          </List>
        )}
      </CustomTabPanel>
    </Paper>
  );
};
