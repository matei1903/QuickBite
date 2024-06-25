import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  color: black;
`;
const PopupContent = styled.div`
  background: #897662;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 100%;

.btn-plata-container {
    display: flex;
    justify-content: center; /* Centrare orizontală */
    margin-top: 20px; /* Spațiu între butoane și butonul de confirmare */
}
.btn-inchide-container {
    display: flex;
    justify-content: center; /* Centrare orizontală */
    margin-top: 20px; /* Spațiu între butoane și butonul de confirmare */
}

.btn-plata {
    border-radius: 20px;
    padding: 5px;
    width: 40px;
    height: 40px;    
}
.btn-plata:hover {
    background-color: #669366; 
}

.btn-inchide {
    border-radius: 20px;
    padding: 5px;
    width: 40px;
    height: 40px; 
}
.btn-inchide:hover {
    background-color: #b26666;
}
`;
const RadioGroup = styled.div`
  margin-bottom: 15px;
`;

const PaymentPopup = ({ onClose, onSubmit }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(selectedOption, paymentMethod);
    };

    return (
        <PopupContainer>
            <PopupContent>
                <h2>Selectează opțiunea de plată</h2>
                <RadioGroup>
                    <label>
                        <input
                            type="radio"
                            value="comandaMea"
                            checked={selectedOption === "comandaMea"}
                            onChange={handleOptionChange}
                        />
                        Comanda mea integral
                    </label>
                    {selectedOption === "comandaMea" && (
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Doar cash
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Doar card
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="custom"
                                    checked={paymentMethod === "custom"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Custom
                            </label>
                        </div>
                    )}
                </RadioGroup>
                <RadioGroup>
                    <label>
                        <input
                            type="radio"
                            value="comandaMesei"
                            checked={selectedOption === "comandaMesei"}
                            onChange={handleOptionChange}
                        />
                        Comanda mesei integral
                    </label>
                    {selectedOption === "comandaMesei" && (
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Doar cash
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Doar card
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="custom"
                                    checked={paymentMethod === "custom"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Custom
                            </label>
                        </div>
                    )}
                </RadioGroup>
                <RadioGroup>
                    <label>
                        <input
                            type="radio"
                            value="custom"
                            checked={selectedOption === "custom"}
                            onChange={handleOptionChange}
                        />
                        Custom
                    </label>
                </RadioGroup>
                <div className="btn-plata-container">
                    <button className="btn-plata" onClick={handleSubmit}><i class="fa fa-money-bill"></i></button>
                </div>
                <div className="btn-inchide-container">
                    <button className="btn-inchide" onClick={onClose}><i class="fa fa-times"></i></button>
                </div>
                
            </PopupContent>
        </PopupContainer>
    );
};
export default PaymentPopup;