"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";

export interface FormField {
  name: string;
  type: "string" | "number" | "boolean";
  label: string;
  description?: string;
  required?: boolean;
  default?: string | number | boolean;
}

export interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  submitLabel?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    // Initialize form values with defaults
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.name] =
        field.default !== undefined ? field.default : "";
    });
    return initialValues;
  });

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configure Settings
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.map((field) => {
            if (field.type === "boolean") {
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Switch
                      checked={Boolean(formValues[field.name])}
                      onChange={(e) =>
                        handleChange(field.name, e.target.checked)
                      }
                    />
                  }
                  label={field.label}
                />
              );
            }

            return (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type === "number" ? "number" : "text"}
                value={formValues[field.name] || ""}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                required={field.required}
                helperText={field.description}
                fullWidth
              />
            );
          })}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {submitLabel}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
