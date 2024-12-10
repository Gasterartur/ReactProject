// Импорт необходимых библиотек и компонентов
import React, { useState, useEffect } from "react"; // React и хуки для управления состоянием и эффектами
import axios from "axios"; // Для выполнения HTTP-запросов
import { useDispatch } from "react-redux"; // Для работы с Redux
import { Link } from "react-router-dom"; // Для навигации между страницами
import { useMediaQuery } from "@mui/material"; // Хук для определения размера экрана
import ProductCard from "../productCard/ProductCard"; // Компонент карточки товара
import { addToCart } from "../../redux/cartSlice"; // Экшен для добавления товара в корзину
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"; // Иконка стрелки влево
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"; // Иконка стрелки вправо
import IconButton from "@mui/material/IconButton"; // Кнопка с иконкой
import Box from "@mui/material/Box"; // Контейнер Box из MUI
import Typography from "@mui/material/Typography"; // Компонент для текста
import API_URL from "../../utils/api"; // URL API

// Функциональный компонент карусели для распродаж
export default function CarouselSale() {
  // Состояния компонента
  const [products, setProducts] = useState([]); // Массив с продуктами
  const [activeStep, setActiveStep] = useState(0); // Текущий шаг карусели
  const dispatch = useDispatch(); // Для диспатча экшенов в Redux

  // Проверка на размеры экрана
  const isLargeScreen = useMediaQuery("(min-width: 1200px)"); // Большие экраны
  const isMediumScreen = useMediaQuery("(min-width: 900px)"); // Средние экраны
  const isSmallScreen = useMediaQuery("(min-width: 600px)"); // Маленькие экраны

  // Количество товаров, видимых одновременно
  let imagesPerView = 1;
  if (isLargeScreen) {
    imagesPerView = 4; // Для больших экранов
  } else if (isMediumScreen) {
    imagesPerView = 3; // Для средних экранов
  } else if (isSmallScreen) {
    imagesPerView = 2; // Для маленьких экранов
  }

  // Эффект для получения данных о товарах при загрузке компонента
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/all`); // Запрос на сервер для получения всех продуктов
        setProducts(response.data); // Установка данных в состояние
      } catch (error) {
        console.error(error); // Логирование ошибок
      }
    };

    fetchProducts(); // Вызов функции загрузки продуктов
  }, []);

  // Фильтрация продуктов со скидкой
  const discountedProducts = products.filter(product => product.discont_price);

  const maxSteps = discountedProducts.length; // Количество шагов (товаров с скидкой)

  // Обработчик перехода на следующий шаг
  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps); // Переход к следующему шагу
  };

  // Обработчик перехода на предыдущий шаг
  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps); // Переход к предыдущему шагу
  };

  // Получение отображаемых товаров
  const getDisplayProducts = () => {
    const startIndex = activeStep; // Начальный индекс
    const endIndex = (activeStep + imagesPerView) % maxSteps; // Конечный индекс
    if (endIndex > startIndex) {
      return discountedProducts.slice(startIndex, endIndex); // Срез, если конец больше начала
    } else {
      return [...discountedProducts.slice(startIndex, maxSteps), ...discountedProducts.slice(0, endIndex)]; // Объединение, если конец меньше начала
    }
  };

  return (
    <Box sx={{ maxWidth: 1440, flexGrow: 1, m: "0 auto", mt: 10, p: "0 16px" }}>
      {/* Заголовок и ссылка на страницу всех товаров со скидками */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mx: 3, mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "clamp(28px, 6vw, 64px)", // Адаптивный размер шрифта
            fontWeight: 700,
            textAlign: "left",
            mr: 3,
          }}
        >
          Sale
        </Typography>
        <Box sx={{ width: "100%", borderBottom: "1px solid #DDDDDD" }}></Box> {/* Разделительная линия */}
        <Link to="/discounted-products">
          <Box
            sx={{
              whiteSpace: "nowrap",
              fontSize: "clamp(10px, 1.5vw, 16px)", // Адаптивный размер текста
              fontWeight: 500,
              color: "#8B8B8B",
              border: "1px solid #DDDDDD",
              borderRadius: "6px",
              padding: "8px 16px",
              minWidth: "fit-content",
              ":hover": { backgroundColor: "#F1F3F4" },
              ":active": { color: "#282828" },
            }}
          >
            All sales
          </Box>
        </Link>
      </Box>

      {/* Контейнер для отображения товаров */}
      <Box sx={{ position: "relative", px: 3 }}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          {getDisplayProducts().map((product) => (
            <ProductCard
              key={product.id}
              product={product} // Продукт для карточки
              addToCart={addToCart} // Диспатч экшена для добавления в корзину
            />
          ))}
        </Box>
        {/* Кнопки для управления каруселью */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
        >
          <IconButton onClick={handleBack}> {/* Кнопка назад */}
            <KeyboardArrowLeft />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
          }}
        >
          <IconButton onClick={handleNext}> {/* Кнопка вперед */}
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
