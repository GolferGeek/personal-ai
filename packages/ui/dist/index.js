"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  ConversationDisplay: () => ConversationDisplay,
  ConversationList: () => ConversationList,
  DynamicForm: () => DynamicForm,
  ErrorDisplay: () => ErrorDisplay,
  TextInputButton: () => TextInputButton
});
module.exports = __toCommonJS(index_exports);

// src/ConversationDisplay/index.tsx
var import_react = require("react");
var import_material = require("@mui/material");
var import_utils = require("@personal-ai/utils");
var import_jsx_runtime = require("react/jsx-runtime");
var ConversationDisplay = ({
  messages,
  isLoading
}) => {
  const messagesEndRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    console.log("ConversationDisplay received messages:", messages);
    console.log("ConversationDisplay isLoading:", isLoading);
  }, [messages, isLoading]);
  (0, import_react.useEffect)(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_material.Paper,
    {
      sx: {
        height: "100%",
        p: 2,
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      },
      children: messages.length === 0 && !isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Typography, { variant: "body1", color: "text.secondary", children: "Start a new conversation or select an existing one" }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_material.Box,
          {
            sx: {
              mb: 2,
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_material.Paper,
              {
                elevation: 1,
                sx: {
                  p: 2,
                  backgroundColor: message.role === "user" ? "primary.light" : "background.paper",
                  borderRadius: 2
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Typography, { variant: "body1", children: message.content }),
                  message.timestamp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Typography, { variant: "caption", color: "text.secondary", sx: { display: "block", mt: 1 }, children: (0, import_utils.formatTimestamp)(message.timestamp) })
                ]
              }
            )
          },
          message.id || index
        )),
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.Box, { sx: { display: "flex", justifyContent: "center", mt: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_material.CircularProgress, { size: 24 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
      ] })
    }
  );
};

// src/ConversationList/index.tsx
var import_material2 = require("@mui/material");
var import_Add = __toESM(require("@mui/icons-material/Add"));
var import_Chat = __toESM(require("@mui/icons-material/Chat"));
var import_utils2 = require("@personal-ai/utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ConversationList = ({
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  conversations,
  isLoading
}) => {
  const renderEmptyState = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_material2.Box,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_Chat.default, { sx: { fontSize: 60, color: "action.disabled", mb: 2 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Typography, { variant: "body1", sx: { mb: 1, textAlign: "center" }, children: "No conversations yet" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Typography, { variant: "body2", sx: { mb: 3, textAlign: "center" }, children: "Start a new conversation to begin" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_material2.Button,
          {
            variant: "outlined",
            startIcon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_Add.default, {}),
            onClick: onNewConversation,
            children: "New Conversation"
          }
        )
      ]
    }
  );
  const renderLoadingState = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_material2.Box,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.CircularProgress, { size: 40, sx: { mb: 2 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Typography, { variant: "body2", color: "text.secondary", children: "Loading conversations..." })
      ]
    }
  );
  const renderConversationItems = () => {
    if (!Array.isArray(conversations) || conversations.length === 0) {
      return renderEmptyState();
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.List, { disablePadding: true, children: conversations.map((conversation) => {
      if (!conversation || !conversation.id) {
        return null;
      }
      const title = (0, import_utils2.getConversationTitle)(conversation);
      const timestamp = (0, import_utils2.getConversationTimestamp)(conversation);
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.ListItem, { disablePadding: true, divider: true, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_material2.ListItemButton,
        {
          selected: selectedConversationId === conversation.id,
          onClick: () => onSelectConversation(conversation.id),
          sx: {
            "&.Mui-selected": {
              backgroundColor: "action.selected"
            }
          },
          "aria-selected": selectedConversationId === conversation.id,
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_material2.ListItemText,
            {
              primary: title,
              secondary: (0, import_utils2.formatRelativeTime)(timestamp),
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_material2.Paper,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_material2.Box, { sx: { p: 2 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Typography, { variant: "h6", sx: { mb: 2 }, children: "Conversations" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_material2.Button,
            {
              variant: "contained",
              startIcon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_Add.default, {}),
              onClick: onNewConversation,
              fullWidth: true,
              disabled: isLoading,
              children: "New Conversation"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Divider, {}),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_material2.Box, { sx: { overflowY: "auto", flexGrow: 1, display: "flex", flexDirection: "column" }, children: isLoading ? renderLoadingState() : renderConversationItems() })
      ]
    }
  );
};

// src/TextInputButton/index.tsx
var import_react2 = require("react");
var import_material3 = require("@mui/material");
var import_Send = __toESM(require("@mui/icons-material/Send"));
var import_jsx_runtime3 = require("react/jsx-runtime");
var TextInputButton = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Type a message...",
  disabled = false
}) => {
  const [inputValue, setInputValue] = (0, import_react2.useState)("");
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_material3.Box, { sx: { display: "flex", width: "100%" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_material3.TextField,
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
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_material3.IconButton,
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
        children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_material3.CircularProgress, { size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_Send.default, {})
      }
    )
  ] });
};

// src/DynamicForm/index.tsx
var import_react3 = require("react");
var import_material4 = require("@mui/material");
var import_jsx_runtime4 = require("react/jsx-runtime");
var DynamicForm = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = "Submit"
}) => {
  const [formData, setFormData] = (0, import_react3.useState)(() => {
    const data = {};
    fields.forEach((field) => {
      data[field.name] = initialData[field.name] !== void 0 ? initialData[field.name] : field.default !== void 0 ? field.default : "";
    });
    return data;
  });
  const [errors, setErrors] = (0, import_react3.useState)({});
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_material4.Box, { component: "form", onSubmit: handleSubmit, noValidate: true, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_material4.Stack, { spacing: 3, children: [
    fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_material4.FormControl,
      {
        fullWidth: true,
        error: !!errors[field.name],
        required: field.required,
        children: field.type === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_material4.FormControlLabel,
          {
            control: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_material4.Switch,
              {
                name: field.name,
                checked: Boolean(formData[field.name]),
                onChange: handleInputChange
              }
            ),
            label: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_material4.Typography, { component: "div", children: [
              field.label,
              field.description && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_material4.Typography, { variant: "caption", display: "block", color: "text.secondary", children: field.description })
            ] })
          }
        ) : field.type === "string" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_material4.TextField,
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
        ) }) : field.type === "number" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          import_material4.TextField,
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
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_material4.Button, { type: "submit", variant: "contained", children: submitLabel })
  ] }) });
};

// src/ErrorDisplay/index.tsx
var import_material5 = require("@mui/material");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ErrorDisplay = ({ errorMessage }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_material5.Box, { sx: { mb: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_material5.Alert, { severity: "error", variant: "filled", children: errorMessage }) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationDisplay,
  ConversationList,
  DynamicForm,
  ErrorDisplay,
  TextInputButton
});
