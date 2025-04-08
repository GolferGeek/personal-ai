// src/ConversationDisplay/index.tsx
import { useRef, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { formatTimestamp } from "@personal-ai/utils";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ConversationDisplay = ({
  messages,
  isLoading
}) => {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    console.log("ConversationDisplay received messages:", messages);
    console.log("ConversationDisplay isLoading:", isLoading);
  }, [messages, isLoading]);
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return /* @__PURE__ */ jsx(
    Paper,
    {
      sx: {
        height: "100%",
        p: 2,
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      },
      children: messages.length === 0 && !isLoading ? /* @__PURE__ */ jsx(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }, children: /* @__PURE__ */ jsx(Typography, { variant: "body1", color: "text.secondary", children: "Start a new conversation or select an existing one" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        messages.map((message, index) => /* @__PURE__ */ jsx(
          Box,
          {
            sx: {
              mb: 2,
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%"
            },
            children: /* @__PURE__ */ jsxs(
              Paper,
              {
                elevation: 1,
                sx: {
                  p: 2,
                  backgroundColor: message.role === "user" ? "primary.light" : "background.paper",
                  borderRadius: 2
                },
                children: [
                  /* @__PURE__ */ jsx(Typography, { variant: "body1", children: message.content }),
                  message.timestamp && /* @__PURE__ */ jsx(Typography, { variant: "caption", color: "text.secondary", sx: { display: "block", mt: 1 }, children: formatTimestamp(message.timestamp) })
                ]
              }
            )
          },
          message.id || index
        )),
        isLoading && /* @__PURE__ */ jsx(Box, { sx: { display: "flex", justifyContent: "center", mt: 2 }, children: /* @__PURE__ */ jsx(CircularProgress, { size: 24 }) }),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] })
    }
  );
};

// src/ConversationList/index.tsx
import {
  Box as Box2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography as Typography2,
  Divider,
  Button,
  Paper as Paper2,
  CircularProgress as CircularProgress2
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import { formatRelativeTime, getConversationTimestamp, getConversationTitle } from "@personal-ai/utils";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ConversationList = ({
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  conversations,
  isLoading
}) => {
  const renderEmptyState = () => /* @__PURE__ */ jsxs2(
    Box2,
    {
      sx: {
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "text.secondary"
      },
      children: [
        /* @__PURE__ */ jsx2(ChatIcon, { sx: { fontSize: 60, color: "action.disabled", mb: 2 } }),
        /* @__PURE__ */ jsx2(Typography2, { variant: "body1", sx: { mb: 1, textAlign: "center" }, children: "No conversations yet" }),
        /* @__PURE__ */ jsx2(Typography2, { variant: "body2", sx: { mb: 3, textAlign: "center" }, children: "Start a new conversation to begin" }),
        /* @__PURE__ */ jsx2(
          Button,
          {
            variant: "outlined",
            startIcon: /* @__PURE__ */ jsx2(AddIcon, {}),
            onClick: onNewConversation,
            children: "New Conversation"
          }
        )
      ]
    }
  );
  const renderLoadingState = () => /* @__PURE__ */ jsxs2(
    Box2,
    {
      sx: {
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      },
      children: [
        /* @__PURE__ */ jsx2(CircularProgress2, { size: 40, sx: { mb: 2 } }),
        /* @__PURE__ */ jsx2(Typography2, { variant: "body2", color: "text.secondary", children: "Loading conversations..." })
      ]
    }
  );
  const renderConversationItems = () => {
    if (!Array.isArray(conversations) || conversations.length === 0) {
      return renderEmptyState();
    }
    return /* @__PURE__ */ jsx2(List, { disablePadding: true, children: conversations.map((conversation) => {
      if (!conversation || !conversation.id) {
        return null;
      }
      const title = getConversationTitle(conversation);
      const timestamp = getConversationTimestamp(conversation);
      return /* @__PURE__ */ jsx2(ListItem, { disablePadding: true, divider: true, children: /* @__PURE__ */ jsx2(
        ListItemButton,
        {
          selected: selectedConversationId === conversation.id,
          onClick: () => onSelectConversation(conversation.id),
          sx: {
            "&.Mui-selected": {
              backgroundColor: "action.selected"
            }
          },
          "aria-selected": selectedConversationId === conversation.id,
          children: /* @__PURE__ */ jsx2(
            ListItemText,
            {
              primary: title,
              secondary: formatRelativeTime(timestamp),
              primaryTypographyProps: {
                noWrap: true,
                style: { fontWeight: selectedConversationId === conversation.id ? 600 : 400 }
              }
            }
          )
        }
      ) }, conversation.id);
    }) });
  };
  return /* @__PURE__ */ jsxs2(
    Paper2,
    {
      elevation: 0,
      sx: {
        width: 300,
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxs2(Box2, { sx: { p: 2 }, children: [
          /* @__PURE__ */ jsx2(Typography2, { variant: "h6", sx: { mb: 2 }, children: "Conversations" }),
          /* @__PURE__ */ jsx2(
            Button,
            {
              variant: "contained",
              startIcon: /* @__PURE__ */ jsx2(AddIcon, {}),
              onClick: onNewConversation,
              fullWidth: true,
              disabled: isLoading,
              children: "New Conversation"
            }
          )
        ] }),
        /* @__PURE__ */ jsx2(Divider, {}),
        /* @__PURE__ */ jsx2(Box2, { sx: { overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column" }, children: isLoading ? renderLoadingState() : renderConversationItems() })
      ]
    }
  );
};

// src/TextInputButton/index.tsx
import { useState } from "react";
import {
  Box as Box3,
  TextField,
  IconButton,
  CircularProgress as CircularProgress3
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var TextInputButton = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Type a message...",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  return /* @__PURE__ */ jsxs3(Box3, { sx: { display: "flex", width: "100%" }, children: [
    /* @__PURE__ */ jsx3(
      TextField,
      {
        fullWidth: true,
        multiline: true,
        maxRows: 4,
        value: inputValue,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        placeholder,
        disabled: isLoading || disabled,
        InputProps: {
          sx: { pr: 1 }
        },
        sx: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4
          }
        }
      }
    ),
    /* @__PURE__ */ jsx3(
      IconButton,
      {
        color: "primary",
        onClick: handleSubmit,
        disabled: !inputValue.trim() || isLoading || disabled,
        sx: {
          ml: 1,
          height: 56,
          width: 56,
          alignSelf: "flex-end"
        },
        "aria-label": "Send message",
        children: isLoading ? /* @__PURE__ */ jsx3(CircularProgress3, { size: 24 }) : /* @__PURE__ */ jsx3(SendIcon, {})
      }
    )
  ] });
};

// src/DynamicForm/index.tsx
import { useState as useState2 } from "react";
import {
  Box as Box4,
  Button as Button2,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  TextField as TextField2,
  Typography as Typography3
} from "@mui/material";
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var DynamicForm = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = "Submit"
}) => {
  const [formData, setFormData] = useState2(() => {
    const data = {};
    fields.forEach((field) => {
      data[field.name] = initialData[field.name] !== void 0 ? initialData[field.name] : field.default !== void 0 ? field.default : "";
    });
    return data;
  });
  const [errors, setErrors] = useState2({});
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = value;
    if (type === "checkbox" || type === "switch") {
      fieldValue = checked;
    } else if (type === "number") {
      fieldValue = value === "" ? "" : Number(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    fields.forEach((field) => {
      if (field.required && (formData[field.name] === void 0 || formData[field.name] === null || formData[field.name] === "")) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
      if (field.type === "number" && formData[field.name] !== "" && isNaN(Number(formData[field.name]))) {
        newErrors[field.name] = `${field.label} must be a valid number`;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "number" && typeof processedData[field.name] === "string") {
          processedData[field.name] = processedData[field.name] === "" ? void 0 : Number(processedData[field.name]);
        }
      });
      onSubmit(processedData);
    }
  };
  return /* @__PURE__ */ jsx4(Box4, { component: "form", onSubmit: handleSubmit, noValidate: true, children: /* @__PURE__ */ jsxs4(Stack, { spacing: 3, children: [
    fields.map((field) => /* @__PURE__ */ jsx4(
      FormControl,
      {
        fullWidth: true,
        error: !!errors[field.name],
        required: field.required,
        children: field.type === "boolean" ? /* @__PURE__ */ jsx4(
          FormControlLabel,
          {
            control: /* @__PURE__ */ jsx4(
              Switch,
              {
                name: field.name,
                checked: Boolean(formData[field.name]),
                onChange: handleInputChange
              }
            ),
            label: /* @__PURE__ */ jsxs4(Typography3, { component: "div", children: [
              field.label,
              field.description && /* @__PURE__ */ jsx4(Typography3, { variant: "caption", display: "block", color: "text.secondary", children: field.description })
            ] })
          }
        ) : field.type === "string" ? /* @__PURE__ */ jsx4(Fragment2, { children: /* @__PURE__ */ jsx4(
          TextField2,
          {
            label: field.label,
            name: field.name,
            value: formData[field.name] || "",
            onChange: handleInputChange,
            error: !!errors[field.name],
            helperText: errors[field.name] || field.description,
            required: field.required,
            fullWidth: true
          }
        ) }) : field.type === "number" ? /* @__PURE__ */ jsx4(Fragment2, { children: /* @__PURE__ */ jsx4(
          TextField2,
          {
            label: field.label,
            name: field.name,
            type: "number",
            value: formData[field.name] || "",
            onChange: handleInputChange,
            error: !!errors[field.name],
            helperText: errors[field.name] || field.description,
            required: field.required,
            fullWidth: true
          }
        ) }) : null
      },
      field.name
    )),
    /* @__PURE__ */ jsx4(Button2, { type: "submit", variant: "contained", children: submitLabel })
  ] }) });
};

// src/ErrorDisplay/index.tsx
import { Alert, Box as Box5 } from "@mui/material";
import { jsx as jsx5 } from "react/jsx-runtime";
var ErrorDisplay = ({ errorMessage }) => {
  return /* @__PURE__ */ jsx5(Box5, { sx: { mb: 2 }, children: /* @__PURE__ */ jsx5(Alert, { severity: "error", variant: "filled", children: errorMessage }) });
};
export {
  ConversationDisplay,
  ConversationList,
  DynamicForm,
  ErrorDisplay,
  TextInputButton
};
