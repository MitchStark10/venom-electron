import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { StyledLayout } from "../Layout";
import {
  FeedbackFormData,
  useSubmitFeedbackMutation,
} from "../store/slices/feedbackSlice";
import { ControlledTextField } from "./ControlledTextField";
import { Header } from "./Header";

export const Feedback = () => {
  const { control, handleSubmit, reset, watch } = useForm<FeedbackFormData>();
  const { name, message, email } = watch();
  const [submitFeedback] = useSubmitFeedbackMutation();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      const response = await submitFeedback(data);
      if ("error" in response && response.error) {
        throw new Error(
          response.error.toString() ?? "Error submitting feedback"
        );
      }
      toast.success("Feedback submitted successfully");
      reset({
        message: "",
        email: "",
        name: "",
      });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Header />{" "}
      <StyledLayout accountForHeader>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            width: "100vw",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              gap: "8px",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" component="h1">
              Feedback
            </Typography>
            <ControlledTextField
              control={control}
              name="message"
              label="Feedback"
              multiline
              rows={4}
              fullWidth
            />
            <ControlledTextField
              control={control}
              name="email"
              label="Email"
              fullWidth
            />
            <ControlledTextField
              control={control}
              name="name"
              label="Name"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={!name || !message || !email}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </StyledLayout>
    </>
  );
};
