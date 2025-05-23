import Layout from "../components/layout/layout";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { getUser, updateUser } from "../api/user";
import { useTranslation } from "react-i18next";
import store from "../store";
import { saveLoading } from "../store/reducer";
import { useNavigate } from "react-router-dom";
import useToast from "hooks/useToast";
import CloseImg from "../assets/Imgs/close-circle.svg";
import UploadImg from "../assets/Imgs/upload.svg";
import { compressionFile, fileToDataURL } from "../utils/image";

const InputGroup = styled.div``;

const CardBox = styled.div`
  min-height: 100%;
  padding: 0 20px;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UlBox = styled.ul`
  width: 100%;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(217, 217, 217, 0.5);
    padding: 15px 0;
    .title {
      color: #9a9a9a;
      font-size: 14px;
    }
  }
`;
const InputBox = styled(InputGroup)`
  flex-grow: 1;
  margin-left: 20px;
  .wallet {
    border: 1px solid #eee;
    width: 100%;
    border-radius: 0.25rem;
    height: 40px;
    padding: 0 1.125rem;
    display: flex;
    align-items: center;
    overflow-x: auto;
  }
  .copy-content {
    position: absolute;
    right: -30px;
    top: 8px;
  }
  input,
  textarea {
    border: 0;
    width: 100%;
    text-align: right;
    font-size: 14px;
    &:focus {
      outline: none;
    }
  }
  textarea {
    margin-bottom: -5px;
    resize: none;
  }
`;
const MidBox = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
  gap: 60px;
`;


const ConfirmBox = styled.div`
  color: var(--primary-color);
  display: inline-block;
  font-size: 17px;
`;

export default function ProfileEdit() {
  // const {
  //   state: { userData },
  //   dispatch,
  // } = useAuthContext();
  // const sns = useParseSNS(userData?.wallet);

  const { t } = useTranslation();
  // const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [twitter, setTwitter] = useState("");
  const [wechat, setWechat] = useState("");
  const [mirror, setMirror] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  // const [wallet, setWallet] = useState("");


  const [height, setHeight] = useState("1em");

  useEffect(() => {
    const textarea = document.getElementById("textarea");
    setHeight(`${textarea.scrollHeight}px`);
  }, [bio]);

  const handleValue = (e) => {
    const { value } = e.target;
    setBio(value);
  };


  const navigate = useNavigate();

  const { Toast, toast } = useToast();



  useEffect(() => {
    getMyDetail();
  }, []);
  const getMyDetail = async () => {
    store.dispatch(saveLoading(true));
    try {
      let rt = await getUser();
      const { avatar, bio, email, discord_profile, twitter_profile, wechat, mirror, wallet, nickname } = rt.data;
      setUserName(nickname);
      setEmail(email);
      let mapArr = new Map();

      rt.data.social_accounts.map((item) => {
        mapArr.set(item.network, item.identity);
      });
      setTwitter(mapArr.get("twitter") ?? "");
      setDiscord(mapArr.get("discord") ?? "");
      setWechat(mapArr.get("wechat") ?? "");
      setMirror(mapArr.get("mirror") ?? "");
      setGithub(mapArr.get("github") ?? "");
      setBio(bio);
      setAvatar(avatar);
      // setWallet(wallet);
    } catch (e) {
      logError(e);
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const handleInput = (e, type) => {
    const { value } = e.target;
    switch (type) {
      case "userName":
        setUserName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "discord":
        setDiscord(value);
        break;
      case "twitter":
        setTwitter(value);
        break;
      case "wechat":
        setWechat(value);
        break;
      case "mirror":
        setMirror(value);
        break;
      // case 'bio':
      //   setBio(value);
      //   break;
      case "github":
        setGithub(value);
        break;
      default:
        return;
    }
  };
  const saveProfile = async () => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !reg.test(email)) {
      toast.danger(t("My.IncorrectEmail"));
      return;
    }
    if (mirror && mirror.indexOf("mirror.xyz") === -1) {
      toast.danger(t("My.IncorrectMirror"));
      return;
    }
    if (twitter && !twitter.startsWith("https://x.com/")) {
      toast.danger(t("My.IncorrectLink", { media: "Twitter" }));
      return;
    }

    store.dispatch(saveLoading(true));
    try {
      const data = {
        name: userName,
        avatar,
        email,
        discord_profile: discord,
        twitter_profile: twitter,
        github_profile: github,
        wechat,
        mirror,
        bio,
      };
      await updateUser(data);
      // dispatch({ type: AppActionType.SET_USER_DATA, payload: { ...userData, ...data } });
      toast.success(t("My.ModifiedSuccess"));
      navigate(-1);
    } catch (error) {
      logError("updateUser failed", error);
      toast.danger(t("My.ModifiedFailed"));
    } finally {
      store.dispatch(saveLoading(false));
    }
  };

  const updateLogo = async (e) => {
    const { files } = e.target;
    const file = files[0];
    const new_file = await compressionFile(file, file.type);
    const base64 = await fileToDataURL(new_file);
    setAvatar(base64);
  };

  const removeUrl = () => {
    setAvatar("");
  };

  return (
    <Layout
      noTab
      title={t("My.EditTitle")}
      rightOperation={<ConfirmBox onClick={saveProfile}>{t("General.confirm")}</ConfirmBox>}
    >
      <CardBox>

        <MidBox>
          <UlBox>
            <li>
              <div className="title">{t("My.Avatar")}</div>
              <AvatarBox>
                <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
                  <img src={UploadImg} alt="" className="rhtBtm"/>
                  {!avatar && (
                    <div>
                      <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />

                    </div>
                  )}
                  {!!avatar && (
                    <ImgBox onClick={() => removeUrl()}>
                      <div className="del">
                        <img src={CloseImg} alt=""/>
                      </div>
                      <img src={avatar} alt="" />
                    </ImgBox>
                  )}
                </UploadBox>
              </AvatarBox>
            </li>
            <li>
              <div className="title">{t("My.Name")}</div>
              <InputBox>
                <input type="text" placeholder="" value={userName} onChange={(e) => handleInput(e, "userName")} />
              </InputBox>
            </li>
            <li>
              <div className="title">{t("My.Bio")}</div>
              <InputBox>
                <textarea
                  id="textarea"
                  placeholder=""
                  style={{ height: height }}
                  value={bio}
                  onChange={(e) => handleValue(e)}
                />
              </InputBox>
            </li>
            <li>
              <div className="title">{t("My.Email")}</div>
              <InputBox>
                <input type="text" placeholder="" value={email} onChange={(e) => handleInput(e, "email")} />
              </InputBox>
            </li>
            <li>
              <div className="title">X</div>
              <InputBox>
                <input type="text" placeholder="https://x.com/home" value={twitter} onChange={(e) => handleInput(e, "twitter")} />
              </InputBox>
            </li>
            <li>
              <div className="title">{t("My.Mirror")}</div>
              <InputBox>
                <input type="text" placeholder="" value={mirror} onChange={(e) => handleInput(e, "mirror")} />
              </InputBox>
            </li>
            <li>
              <div className="title">{t("My.Github")}</div>
              <InputBox>
                <input type="text" placeholder="" value={github} onChange={(e) => handleInput(e, "github")} />
              </InputBox>
            </li>
          </UlBox>
        </MidBox>
      </CardBox>
      {Toast}
    </Layout>
  );
}

const UploadBox = styled.label`
  background: #f8f8f8;
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-top: 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  .iconRht {
    margin-right: 10px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .rhtBtm{
    position: absolute;
    z-index: 9999;
    width: 18px;
    height: 18px;
    right: 0;
    bottom: -3px;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  .del {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    //display: flex;
    align-items: center;
    justify-content: center;
    background: #a16eff;
    opacity: 0.5;
    color: #fff;
    cursor: pointer;
    .iconTop {
      font-size: 40px;
    }
  }
  &:hover {
    .del {
      display: flex;
    }
  }
`;
