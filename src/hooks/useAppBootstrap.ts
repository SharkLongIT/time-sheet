import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/redux/store";
import { checkHasSeenWelcome } from "~/thunk/appSlice";
import { checkAuth } from "~/thunk/authThunk";

export const useAppBootstrap = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuth());
        dispatch(checkHasSeenWelcome());
    }, [dispatch]);
};