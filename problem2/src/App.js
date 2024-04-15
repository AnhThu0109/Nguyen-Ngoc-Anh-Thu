import React, { useState, useEffect } from "react";
import { Form, Typography, InputNumber, Modal, Button, Input } from "antd";
import getAll from "./utils/getAll";
import getImage from "./utils/getImage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import formatNumber from "./utils/formatNumber";
import formatDate from "./utils/formatDate";

function App() {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [options, setOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonTitle, setButtonTitle] = useState({
    imgSrc: "/static/media/USD.0fbb0e196fc58887b60a.svg",
    currency: "USD",
    price: 1,
  });
  const [buttonConvertedTitle, setButtonConvertedTitle] = useState({
    imgSrc: "/static/media/USD.0fbb0e196fc58887b60a.svg",
    currency: "USD",
    price: 1,
  });
  const [buttonTypeOpening, setButtonTypeOpening] = useState("");
  const [enterNumber, setEnterNumber] = useState(1);
  const [covertedNumber, setConvertedNumber] = useState(1);
  const [messageError, setMessageError] = useState(null);
  const [updateDate, setUpdateDate] = useState(null);
  const [selectedCurrencies, setSelectedCurrencies] = useState({
    original: "USD",
    converted: "USD",
  });
  const [modalOpen, setModalOpen] = useState({
    original: false,
    converted: false,
  });

  const showModal = (buttonOpen) => {
    setIsModalOpen(true);
    setButtonTypeOpening(buttonOpen);
    setModalOpen((prevState) => ({
      ...prevState,
      [buttonOpen]: true,
    }));
  };

  const onCancelModal = () => {
    setIsModalOpen(false);
    setModalOpen({ original: false, converted: false });
  };

  function importAll(r) {
    return r.keys().map(r);
  }

  const images = importAll(
    require.context("../public/tokens", false, /\.(png|jpe?g|svg)$/)
  );

  const handleChosenCurrency = (item, imgSrc) => {
    setIsModalOpen(false);
    setSelectedCurrencies((prevState) => ({
      ...prevState,
      [buttonTypeOpening]: item.currency.toUpperCase(),
    }));
    setUpdateDate(item.date);
    if (buttonTypeOpening === "original") {
      setButtonTitle({
        imgSrc: imgSrc,
        currency: item.currency.toUpperCase(),
        price: item.price,
      });
    } else if (buttonTypeOpening === "converted") {
      setButtonConvertedTitle({
        imgSrc: imgSrc,
        currency: item.currency.toUpperCase(),
        price: item.price,
      });
    }
    setModalOpen({ original: false, converted: false });
  };

  const initData = async () => {
    try {
      const data = await getAll("https://interview.switcheo.com/prices.json");
      if (data.length > 0) {
        const uniqueItems = [
          ...new Map(data.map((item) => [item.currency, item])).values(),
        ];
        const optionList = await Promise.all(
          uniqueItems.map(async (element, index) => {
            // Call getImage synchronously
            const imgSrc = await getImage(element.currency, images);
            return (
              <li
                className={`list-group-item ${
                  modalOpen.original === true &&
                  selectedCurrencies.original === element.currency.toUpperCase()
                    ? "activeCurrency"
                    : modalOpen.converted === true &&
                      selectedCurrencies.converted ===
                        element.currency.toUpperCase()
                    ? "activeCurrency"
                    : ""
                }`}
                onClick={() => handleChosenCurrency(element, imgSrc)}
                key={index}
              >
                <img
                  src={imgSrc}
                  alt={element.currency}
                  className="currencyImg me-3"
                />
                <span className="currencyTitle">
                  {element.currency.toUpperCase()}
                </span>
              </li>
            );
          })
        );
        // return optionList;
        setOptions(optionList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const handleChangeNumber = async (value) => {
    setMessageError(null); // Reset message error when input changes
    setEnterNumber(value);
    const number = (value * buttonConvertedTitle.price) / buttonTitle.price;
    setConvertedNumber(formatNumber(number));
    await checkPrice(value);
  };

  const checkPrice = async (number) => {
    return new Promise((resolve, reject) => {
      console.log(number)
      if(number === null){
        setMessageError("Please enter a valid amount");
        setConvertedNumber(0);}
      else if (number <= 0) {
        setMessageError("Please enter an amount greater than 0");
        setConvertedNumber(0);
      } else {
        setMessageError(null);
      }
    });
  };

  const handleExchangeCurrency = () => {
    // Store the current buttonTitle and buttonConvertedTitle values
    const currentButtonTitle = { ...buttonTitle };
    const currentButtonConvertedTitle = { ...buttonConvertedTitle };
    const currentSelectedCurrencies = { ...selectedCurrencies };

    // Update buttonTitle
    setButtonTitle({
      imgSrc: currentButtonConvertedTitle.imgSrc,
      currency: currentButtonConvertedTitle.currency,
      price: currentButtonConvertedTitle.price,
    });

    // Update buttonConvertedTitle
    setButtonConvertedTitle({
      imgSrc: currentButtonTitle.imgSrc,
      currency: currentButtonTitle.currency,
      price: currentButtonTitle.price,
    });

    //Update selectedCurrencies
    setSelectedCurrencies({
      original: currentSelectedCurrencies.converted,
      converted: currentSelectedCurrencies.original,
    });
  };

  useEffect(() => {
    initData();
    handleChangeNumber(enterNumber);
  }, [
    isModalOpen,
    modalOpen,
    buttonTypeOpening,
    covertedNumber,
    buttonTitle,
    buttonConvertedTitle,
    messageError,
  ]);

  return (
    <>
      <div className="titleText mt-5 pt-5">
        <Title level={1}>
          {buttonTitle.currency}/{buttonConvertedTitle.currency} Currency
          Converter
        </Title>
      </div>
      <Form
        form={form}
        colon={false}
        name="basic"
        className="row p-5 m-5 rounded-5"
      >
        <Form.Item
          className="col"
          messageVariables={{ another: "good" }}
          validateStatus={messageError ? "error" : ""}
          help={messageError || ""}
        >
          <Title level={4} className="float-start text-black-50">
            Amount
          </Title>
          <InputNumber
            name="enterNumber"
            onChange={handleChangeNumber}
            className="w-100"
            addonAfter={
              <Button
                className="buttonCurrency border-0"
                onClick={() => showModal("original")}
              >
                <img
                  src={buttonTitle.imgSrc}
                  alt={buttonTitle.currency}
                  className="currencyImg me-3"
                />
                <span className="currencyTitle">{buttonTitle.currency}</span>
              </Button>
            }
            defaultValue={1}
          />
        </Form.Item>
        <Button
          className="col-1 exchangeBtn mx-2 rounded-circle"
          onClick={handleExchangeCurrency}
        >
          <img src="./exchangeIcon.png" alt="exchangeIcon" />
        </Button>
        <Form.Item
          className="col"
          messageVariables={{ another: "good" }}
          rules={[{ required: true, message: " is required" }]}
        >
          <Title level={4} className="float-start text-black-50">
            Converted to
          </Title>
          <Input
            readOnly
            value={covertedNumber}
            className="w-100"
            addonAfter={
              <Button
                className="buttonCurrency border-0"
                onClick={() => showModal("converted")}
              >
                <img
                  src={buttonConvertedTitle.imgSrc}
                  alt={buttonConvertedTitle.currency}
                  className="currencyImg me-3"
                />
                <span className="currencyTitle">
                  {buttonConvertedTitle.currency}
                </span>
              </Button>
            }
            defaultValue={0}
          />
        </Form.Item>
        <div className="mt-4 d-flex flex-column">
          <Title level={2}>
            1 {buttonTitle.currency} ={" "}
            <span className="exchangeNumber">
              {formatNumber(buttonConvertedTitle.price / buttonTitle.price)}
            </span>{" "}
            {buttonConvertedTitle.currency}
          </Title>
          {buttonTitle.currency !== buttonConvertedTitle.currency && (
            <Title level={2} className="mt-1">
              1 {buttonConvertedTitle.currency} ={" "}
              <span className="exchangeNumber">
                {formatNumber(buttonTitle.price / buttonConvertedTitle.price)}
              </span>{" "}
              {buttonTitle.currency}
            </Title>
          )}
          <p className="text-black-50">Updated at {formatDate(updateDate)}</p>
        </div>
      </Form>
      <Modal
        footer=""
        open={isModalOpen}
        onCancel={onCancelModal}
        closable={false}
      >
        <ul className="list-group">{options}</ul>
      </Modal>
    </>
  );
}

export default App;
