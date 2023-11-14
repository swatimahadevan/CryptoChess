import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import "./adminportal.css"; 
import Loader from "../Loader/Loader";
import { ADMINS } from "../../constants/admin"
import Button from "react-bootstrap/Button";

const AdminPortal = ({isConnected, user, deposit, withdraw, getBalance}) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [balance, setBalance] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsAdmin(ADMINS.includes(user))
    }, [user])

    const getInfo = async() => {
        if (isAdmin && !isLoading) {
            const bal = await getBalance()
            setBalance(Number(bal))
        }
    }

    useEffect(() => {
        const fn = async() => {
            if (isAdmin) {
                setIsLoading(true);
                await getInfo();
                setIsLoading(false);
            }
        }
        fn()
    }, [isAdmin])

    const withdrawEther = async() => {
        setIsLoading(true)
        await withdraw(withdrawAmount);
        await getInfo()
        setIsLoading(false)
    }

    const depositEther = async() => {
        setIsLoading(true)
        await deposit(depositAmount);
        await getInfo()
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="admin-container">
                <Loader/>
            </div>
        )
    }

    return (
        isConnected ? 
        !isAdmin ?
        <div className="global-message">You do not have access to this page</div>
        :
        <div className="admin-container global-message">
            <p>Welcome admin {user}</p>
            <p>The Contract Balance: {balance}</p>
            <div  className="input-row">
                <div className="input-field">
                    <input
                        value={withdrawAmount}
                        onChange={event => setWithdrawAmount(event.target.value)}
                        placeholder='Withdraw Amount'
                        size='sm'
                    />
                    <Button disabled={withdrawAmount > balance} onClick={async() => await withdrawEther()}>Withdraw</Button>
                </div>
                <div>
                    <input
                        value={depositAmount}
                        onChange={event => setDepositAmount(event.target.value)}
                        placeholder='Deposit Amount'
                        size='sm'
                    />
                    <Button onClick={async() => await depositEther()}>Deposit</Button>
                </div>
            </div>
        </div>
    :
    <Navigate to="/CryptoChess/Home" />
    )
}

export default AdminPortal;