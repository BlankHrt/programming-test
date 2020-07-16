import React from 'react';
import './layout.css';
import { Layout, Menu } from 'antd';
import CustomContent from '../Content/Content';

const { Header, Content, Footer } = Layout;

export default class CustomLayout extends React.Component {
    state = {

    }

    render() {
        return <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">TodoManage</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '20px 50px' }}>
                <CustomContent />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>;
    }
}
