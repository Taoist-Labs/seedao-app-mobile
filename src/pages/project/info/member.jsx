import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useProjectContext } from "./provider";
import store from "store";
import { saveLoading } from "store/reducer";
import { useEffect, useMemo, useState } from "react";
import { getUsers } from "api/user";
import UserList from "components/userList";

export default function ProjectMember() {
  const { t } = useTranslation();
  const {
    state: { data },
  } = useProjectContext();
  const [userMap, setUserMap] = useState({});
  const [members, setMembers] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const getUsersInfo = async (wallets) => {
    if (!wallets.length) {
      return;
    }
    store.dispatch(saveLoading(true));

    try {
      const res = await getUsers(wallets);
      const userData = {};
      res.data.forEach((r) => {
        userData[r.wallet || ""] = r;
      });
      setUserMap(userData);
      console.log("userData:", userData);
    } catch (error) {
      console.error("getUsersInfo error:", error);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };
  const { memberUsers, sponsorUsers } = useMemo(() => {
    return {
      memberUsers: members.map((m) => userMap[m]),
      sponsorUsers: sponsors.map((s) => userMap[s]),
    };
  }, [userMap, members, sponsors]);

  useEffect(() => {
    const members = data?.members || [];
    const sponsors = data?.sponsors || [];
    setMembers(members.map((m) => m.toLowerCase()));
    setSponsors(sponsors.map((m) => m.toLowerCase()));
    getUsersInfo(Array.from(new Set([...members, ...sponsors])));
  }, [data]);
  return (
    <MemberContent>
      <Block>
        <SectionTitle>{t("Project.Dominator")}</SectionTitle>
        <UserList data={memberUsers} />
      </Block>
      <Block>
        <SectionTitle>{t("Project.Members")}</SectionTitle>
        <UserList data={sponsorUsers} />
      </Block>
    </MemberContent>
  );
}

const MemberContent = styled.div`
  padding-inline: 20px;
`

const Block = styled.section`
  &:first-child {
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
`;