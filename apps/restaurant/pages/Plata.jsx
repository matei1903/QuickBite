import React, { useState } from "react";
import styled from "styled-components";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  
 
  .inchide {
    margin-left: 30%;
  }
 
  
`;

const RadioGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
        onClose();
    };

    return (
        <PopupContainer>
            <PopupContent>
                <h2>Selectează opțiunea de plată</h2>
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
                
                    <button className="plateste" onClick={handleSubmit}>Plătește</button>
                    <button className="inchide" onClick={onClose}>Închide</button>
                
            </PopupContent>
        </PopupContainer>
    );
};

export default PaymentPopup;