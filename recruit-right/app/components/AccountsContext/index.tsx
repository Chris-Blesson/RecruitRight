"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const defaultAccountDetails = {
  account_id: null,
  type: null,
  email: null,
  name: null,
  resume_url: null,
  resume_payload: {
    basics: {
      Basics: {
        name: null,
        email: null,
        website: null,
        address: null,
        phone: null,
      },
    },
    education: [],
    awards: [],
    projects: [],
    skills: [],
    work: [],
  },
  organisation: null,
  created_at: "2024-07-13T12:06:25.174Z",
};
const AccountsContext = createContext({
  accountDetails: defaultAccountDetails,
  accountContextLoading: true,
  accountContextError: null,
  refetchAccountDetails: () => {},
  updateAccountDetails: (updateAccountPayload, { onSuccess, onError }) => {},
  updateAccountLoading: false,
});

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

  const [updateAccountLoading, setUpdateAccountLoading] = useState(false);

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
      setUpdateAccountLoading(true);
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
          setUpdateAccountLoading(false);
          onSuccess?.();
        })
        .catch((err) => {
          setAccountPayload({
            ...accountPayload,
            loading: false,
            error: err,
          });
          setUpdateAccountLoading(false);
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
        accountDetails: accountPayload.data || defaultAccountDetails,
        accountContextLoading: accountPayload.loading,
        accountContextError: accountPayload.error,
        refetchAccountDetails: fetchAccountDetails,
        updateAccountDetails,
        updateAccountLoading,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsContextProvider;
