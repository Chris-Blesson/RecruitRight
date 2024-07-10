"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AccountsContext = createContext({});

export const useAccountsContext = () => {
  const accountPayload = useContext(AccountsContext);
  return {
    ...accountPayload,
  };
};
const AccountsContextProvider = ({ children }: { children: any }) => {
  const [accountPayload, setAccountPayload] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAccountDetails = useCallback(async () => {
    setAccountPayload({
      data: null,
      loading: true,
      error: null,
    });
    fetch(`/api/accounts`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAccountPayload({
          ...accountPayload,
          loading: false,
          data,
        });
      })
      .catch((err) => {
        setAccountPayload({
          ...accountPayload,
          loading: false,
          error: err,
        });
      });
  }, [accountPayload]);

  const updateAccountDetails = useCallback(
    async (updateAccountPayload, { onSuccess, onError }) => {
      setAccountPayload({
        data: null,
        loading: true,
        error: null,
      });
      fetch(`/api/accounts/update`, {
        method: "post",
        body: JSON.stringify({ ...updateAccountPayload }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setAccountPayload({
            ...accountPayload,
            loading: false,
            data,
          });
          onSuccess?.();
        })
        .catch((err) => {
          setAccountPayload({
            ...accountPayload,
            loading: false,
            error: err,
          });
          onError?.();
        });
    },
    [accountPayload]
  );

  useEffect(() => {
    fetchAccountDetails();
  }, []);
  return (
    <AccountsContext.Provider
      value={{
        accountDetails: accountPayload.data,
        accountContextLoading: accountPayload.loading,
        accountContextError: accountPayload.error,
        refetchAccountDetails: fetchAccountDetails,
        updateAccountDetails,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsContextProvider;
