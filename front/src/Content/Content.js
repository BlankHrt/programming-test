import React from 'react';
import { Table, Button, Modal, Input, Popconfirm, message } from 'antd';


export default class CustomContent extends React.Component {
    state = {
        name: '',
        desc: '',
        id: '',
        loading: false,
        visible: false,
        data: [],
        columns: [
            {
                title: 'name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'desc',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                key: 'operation',
                render: (i, data) => <>
                    <Popconfirm
                        title="sure?"
                        onConfirm={() => this.deleteById(i, data)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a style={{ marginRight: 10 + 'px' }}>Delete</a>
                    </Popconfirm>
                    <a onClick={() => this.updateById(i, data)}>edit</a></>,
            },
        ]
    }
    deleteById = (i, data) => {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                mutation  ($id:String){
                                    deleteTodo(id: $id) {
                                        id
                                    }
                        }
                `,
                id: data.id
            })
        }).then(r => r.json())
            .then(() => {
                this.refresh();
            });
    }
    updateById = (i, data) => {
        this.setState({
            visible: true,
            name: data.name,
            desc: data.desc,
            id: data.id
        });
    }
    toggleModal = () => {
        this.setState({ visible: !this.state.visible });
    }

    upsert = () => {
        const { name, desc, id } = this.state;

        if (name && desc) {
            if (!id) {
                fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `mutation createTodo($input: TodoInput) {
                                            createTodo(input: $input) {
                                                id
                                            }
                                }`,
                        name: this.state.name,
                        desc: this.state.desc,
                    })
                }).then(r => r.json())
                    .then(() => {
                        this.setState({ visible: false, name: '', desc: '', id: '' });
                        this.refresh();
                    });
            } else {
                fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `mutation ($id: String, $name: String, $desc: String) {
                                            updateTodo(id: $id,name:$name,desc:$desc) {
                                                id,name,desc
                                            }
                                }`,
                        id, name, desc
                    })
                }).then(r => r.json())
                    .then(() => {
                        this.setState({ visible: false, name: '', desc: '', id: '' });
                        this.refresh();
                    });
            }
        } else {
            message.warn('all field required!');
        }
    }
    changeInput = (e, prop) => {
        this.setState({
            [prop]: e.target.value
        });
    }
    componentDidMount() {
        this.setState({ loading: true })
        this.refresh();
    }
    refresh = () => {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: 'query {getAllTodo{name desc id}}'
            })
        })
            .then(r => r.json())
            .then(res => {
                let data = res.data.getAllTodo;
                data.map(e => e['key'] = e.id);
                this.setState({ data, loading: false });
            });
    }

    render() {
        const { data, columns, loading } = this.state;
        return <>
            < div className="operation" >
                <Button style={{ marginRight: 20 + 'px' }} type="primary" onClick={() => this.toggleModal()}>add</Button>
                <Button type="primary" onClick={() => this.refresh()}>refresh</Button>
            </div >
            <div className="site-layout-content" style={{ minHeight: (window.innerHeight - 164) + 'px' }}>
                <Table columns={columns} dataSource={data} bordered loading={loading}
                    title={() => 'todoList'} />
            </div>
            <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={() => this.upsert()}
                onCancel={() => this.toggleModal()}
            >
                <Input style={{ marginBottom: 20 + 'px' }} placeholder="name" value={this.state.name} onChange={e => this.changeInput(e, 'name')} />
                <Input placeholder="desc" value={this.state.desc} onChange={e => this.changeInput(e, 'desc')} />
            </Modal>
            </>;
    }
}
