// Импорт необходимых библиотек и компонентов
import React from "react"; 
import { useForm } from "react-hook-form"; // Хук для управления формами
import { useDispatch } from "react-redux"; // Для использования действий Redux
import { openModal } from '../../redux/modalSlice'; // Импорт действия для открытия модального окна
import { clearCart } from '../../redux/cartSlice'; // Импорт действия для очистки корзины
import axios from "axios"; // Для отправки HTTP-запросов
import API_URL from "../../utils/api"; // Базовый URL API
import { TextField, Button, Snackbar, Alert, CircularProgress } from "@mui/material"; // Компоненты интерфейса из MUI


// Функциональный компонент формы оформления заказа
function FormCart({ orderData, form = {}, onInputChange }) {
    // Инициализация хуков
    const { register, handleSubmit, formState } = useForm(); // Хук управления формой
    const [showAlert, setShowAlert] = React.useState(false); // Состояние отображения уведомления
    const [isLoading, setIsLoading] = React.useState(false); // Состояние загрузки
    const [isSubmitted, setIsSubmitted] = React.useState(false); // Состояние успешной отправки
    const dispatch = useDispatch(); // Использование dispatch для отправки действий в Redux

    const { errors } = formState; // Доступ к ошибкам валидации

    // Обработчик отправки формы
    const onSubmit = async (data) => {
        setIsLoading(true); // Включение индикатора загрузки
        try {
            // Отправка данных на сервер
            const response = await axios.post(`${API_URL}/order/send`, {
                ...data, // Данные из формы
                products: orderData.products, // Продукты из корзины
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data); // Логирование ответа сервера
            setShowAlert(true); // Показ уведомления об успешной отправке
            setIsSubmitted(true); // Установка состояния отправки
            setTimeout(() => {
                setShowAlert(false); // Скрытие уведомления через 3 секунды
            }, 3000);
            handlePlaceOrder(); // Вызов обработчика завершения заказа
        } catch (error) {
            console.error('Error submitting form', error); // Логирование ошибки
        } finally {
            setIsLoading(false); // Выключение индикатора загрузки
        }
    };

    // Обработчик завершения оформления заказа
    function handlePlaceOrder() {
        dispatch(openModal({ title: "Congratulations!" })); // Открытие модального окна с поздравлением
        setTimeout(() => { dispatch(clearCart()); }, 1000); // Очистка корзины через секунду
    }

    // Значения полей из пропсов (или пустые строки по умолчанию)
    const nameValue = form?.name || ""; 
    const phoneValue = form?.phone || "";
    const emailValue = form?.email || "";

    return (
        <div className={styles.Form_form}> {/* Контейнер формы */}
            <form onSubmit={handleSubmit(onSubmit)}> {/* Форма с обработчиком отправки */}
                {/* Поле для имени */}
                <TextField 
                    {...register("name", { // Регистрация поля в React Hook Form
                        required: "Name is required", // Валидация: обязательное поле
                        minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters", // Ошибка валидации
                        },
                    })}
                    error={!!errors.name} // Подсветка ошибок
                    helperText={errors.name && errors.name.message} // Текст ошибки
                    label="Name" // Метка поля
                    variant="outlined" // Внешний вид
                    fullWidth // Полная ширина
                    margin="dense" // Уменьшенные отступы
                    value={nameValue} // Текущее значение поля
                    onChange={onInputChange} // Обработчик изменения
                    name="name" 
                    FormHelperTextProps={{
                        style: { fontSize: "20px" }, // Настройка стиля текста ошибок
                    }}
                />
                {/* Поле для телефона */}
                <TextField
                    {...register("phone", { 
                        required: "Phone is required", 
                        minLength: {
                            value: 10,
                            message: "Phone must be at least 10 characters",
                        },
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone && errors.phone.message}
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={phoneValue}
                    onChange={onInputChange}
                    name="phone"
                    FormHelperTextProps={{
                        style: { fontSize: "20px" },
                    }}
                />
                {/* Поле для email */}
                <TextField
                    {...register("email", { 
                        required: "Email is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Entered value does not match email format",
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={emailValue}
                    onChange={onInputChange}
                    name="email"
                    FormHelperTextProps={{
                        style: { fontSize: "20px" },
                    }}
                />
                {/* Кнопка отправки */}
                <Button
                    className={styles.btnCartForm}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading} // Отключение кнопки во время загрузки
                    endIcon={isLoading && <CircularProgress size={20} />} // Индикатор загрузки
                    sx={{
                        textTransform: 'none',
                        fontSize: "20px",
                        mt: 2,
                        width: "100%",
                        height: "58px",
                        backgroundColor: isSubmitted ? "#FFFFFF" : "#0D50FF",
                        color: isSubmitted ? "#282828" : "#FFFFFF",
                        border: isSubmitted ? "1px solid #282828" : "none",
                        "&:hover": {
                            backgroundColor: "#282828",
                            color: "#FFFFFF",
                        },
                    }}
                >
                    {isSubmitted ? "The Order is Placed" : isLoading ? "Submitting..." : "Order"} {/* Изменение текста кнопки */}
                </Button>
            </form>
            {/* Уведомление об успешной отправке */}
            {showAlert && (
                <Snackbar open={showAlert}>
                    <Alert severity="success">Form submitted successfully!</Alert>
                </Snackbar>
            )}
        </div>
    );
}

export default FormCart; // Экспорт компонента
