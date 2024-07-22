"use client";
import { Layout, Spin } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Header, { HeaderContextProvider } from "../Header";
import Sidebar from "../Sidebar";
import OnboardingForm from "../Onboarding";

const defaultAccountDetails = {
  account_id: null,
  type: null,
  email: null,
  name: null,
  resume_url: null,
  resume_payload: {
    Basics: {
      name: null,
      email: null,
      website: null,
      address: null,
      phone: null,
      improvments_suggestions: null,
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
  changeSidebarView: ({ open }: { open: boolean }) => {},
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

  const [spinning, setSpinning] = useState(false);
  const [percent, setPercent] = useState(0);

  const [showSidebar, setShowSidebar] = useState(true);
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
        if (data?.message === "Not found") {
          setAccountPayload({
            ...accountPayload,
            loading: false,
            data: null,
          });
        } else if (data?.message === "Unauthorized") {
          console.log("fetch", data);
          setAccountPayload({
            ...accountPayload,
            loading: false,
            data: null,
          });
        } else {
          setAccountPayload({
            ...accountPayload,
            loading: false,
            data,
          });
        }
      })
      .catch((err) => {
        window?.location?.replace("/sign-in");
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

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setPercent(0);
      }
    }, 100);
  };

  const changeSidebarView = ({ open }) => {
    setShowSidebar(open);
  };
  useEffect(() => {
    fetchAccountDetails();
  }, []);

  useEffect(() => {
    if (accountPayload.loading) {
      showLoader();
    }
  }, [accountPayload?.loading]);

  if (accountPayload?.loading) {
    return <Spin spinning={spinning} percent={percent} fullscreen />;
  }
  if (!accountPayload.data) {
    return <OnboardingForm />;
  }
  return (
    <AccountsContext.Provider
      value={{
        accountDetails: accountPayload.data || defaultAccountDetails,
        accountContextLoading: accountPayload.loading,
        accountContextError: accountPayload.error,
        refetchAccountDetails: fetchAccountDetails,
        updateAccountDetails,
        updateAccountLoading,
        changeSidebarView,
      }}
    >
      <Layout hasSider>
        {showSidebar && <Sidebar />}
        <Layout
          style={{
            marginLeft: showSidebar ? 200 : 0,
            height: "100vh",
            backgroundColor: "#f0f0f0",
            color: "#1f1f1f",
          }}
        >
          <HeaderContextProvider>
            <Header />
            <div className="px-4 max-h-[95vh] overflow-auto rounded-md">
              {children}
            </div>
          </HeaderContextProvider>
        </Layout>
      </Layout>
    </AccountsContext.Provider>
  );
};

export default AccountsContextProvider;
