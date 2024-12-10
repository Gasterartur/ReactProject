import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, CircularProgress, Snackbar, Alert, TextField } from "@mui/material";
import styles from "./FormCart.module.css";
import API_URL from "../../utils/api";

// Я создаю объект общих стилей для TextField, чтобы не дублировать код
const textFieldStyles = {
  mt: 2,
  width: "100%",
  "& input": {
    caretColor: "#FFFFFF",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#FFFFFF",
    },
    "&:hover fieldset": {
      borderColor: "#FFFFFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFFFFF",
    },
  },
  "& .MuiFormLabel-root": {
    color: "#FFFFFF",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#FFFFFF",
    opacity: 0.6,
  },
};

// Я создаю функцию для стилизации кнопки в зависимости от состояния (например, отправлено или нет)
const buttonStyles = (isSubmitted) => ({
  textTransform: "none",
  fontSize: "20px",
  mt: 2,
  mb: 0,
  width: "100%",
  height: "58px",
  backgroundColor: isSubmitted ? "#F1F3F4" : "#FFFFFF",
  color: isSubmitted ? "#0D50FF" : "#282828",
  "&:hover": {
    backgroundColor: isSubmitted ? "#282828" : "#282828",
    color: "#FFFFFF",
  },
  "&:active": {
    backgroundColor: "#F1F3F4",
    color: "#0D50FF",
  },
});

// Я создаю компонент формы
function Form() {
  // Я использую React Hook Form для управления вводом и валидацией
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Я создаю состояние для отображения загрузки
  const [isLoading, setIsLoading] = useState(false);

  // Я создаю состояние для показа уведомления
  const [showAlert, setShowAlert] = useState(false);

  // Я создаю состояние для проверки, отправлена ли форма
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Я создаю функцию для обработки отправки формы
  const onSubmit = async (data) => {
    setIsLoading(true); // Устанавливаю состояние загрузки
    try {
      // Я отправляю данные на сервер через API
      const response = await axios.post(`${API_URL}/sale/send`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data); // Я вывожу данные ответа в консоль
      setShowAlert(true); // Я показываю уведомление об успешной отправке
      setIsSubmitted(true); // Я устанавливаю состояние "отправлено"
      setTimeout(() => setShowAlert(false), 3000); // Я скрываю уведомление через 3 секунды
    } catch (error) {
      // Если есть ошибка, я вывожу её в консоль
      console.error("Error submitting form", error);
    } finally {
      setIsLoading(false); // Я выключаю состояние загрузки
    }
  };

  return (
    <div className={styles.Form_form}>
      <form onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: "516px" }}>
        {/* Я создаю поле ввода имени */}
        <TextField
          sx={textFieldStyles}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
          error={!!errors.name} // Я проверяю, есть ли ошибка для имени
          helperText={errors.name?.message} // Я показываю текст ошибки, если он есть
          label="Name"
          variant="outlined"
          fullWidth
          margin="dense"
        />
        {/* Я создаю поле ввода телефона */}
        <TextField
          sx={textFieldStyles}
          {...register("phone", {
            required: "Phone is required",
            minLength: { value: 10, message: "Phone must be at least 10 characters" },
          })}
          error={!!errors.phone} // Я проверяю, есть ли ошибка для телефона
          helperText={errors.phone?.message} // Я показываю текст ошибки, если он есть
          label="Phone"
          variant="outlined"
          fullWidth
          margin="dense"
        />
        {/* Я создаю поле ввода email */}
        <TextField
          sx={textFieldStyles}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
          })}
          error={!!errors.email} // Я проверяю, есть ли ошибка для email
          helperText={errors.email?.message} // Я показываю текст ошибки, если он есть
          label="Email"
          variant="outlined"
          fullWidth
          margin="dense"
        />
        {/* Я создаю кнопку для отправки формы */}
        <Button
          className={styles.btnForm}
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading} // Я отключаю кнопку, если идет загрузка
          endIcon={isLoading && <CircularProgress size={20} />} // Я добавляю индикатор загрузки
          sx={buttonStyles(isSubmitted)}
        >
          {/* Я изменяю текст кнопки в зависимости от состояния */}
          {isSubmitted ? "Request Submitted" : isLoading ? "Submitting..." : "Get a discount"}
        </Button>
      </form>
      {/* Я показываю уведомление, если форма успешно отправлена */}
      {showAlert && (
        <Snackbar open={showAlert} autoHideDuration={3000}>
          <Alert severity="success">Form submitted successfully!</Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default Form;
