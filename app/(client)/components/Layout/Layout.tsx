'use client';

import { Layout } from 'antd';
import { userInfoState } from 'app/(client)/recoil/user';
import { memo, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { Container } from './Container';
import { Footer } from './Footer';
import { Header } from './Header';

const LayoutStyle = styled(Layout)`
  &&& {
    min-height: 100vh;
    overflow-y: auto;
  }
`;

interface Props {
  children: React.ReactNode;
  userInfo?: UserInfo;
}
export const BasicLayout = memo<Props>(function BasicLayout(props) {
  const [userInfo, updateUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    if (!userInfo && props.userInfo) {
      updateUserInfo(props.userInfo);
    }
  }, [props.userInfo]);

  return (
    <LayoutStyle>
      <Header />
      <Layout.Content>
        <Container className="main-container">{props.children}</Container>
      </Layout.Content>
      <Footer />
    </LayoutStyle>
  );
});
