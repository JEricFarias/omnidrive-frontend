import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DropZone from 'react-dropzone';
import socket from 'socket.io-client';

import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

export default class Box extends Component {
  state = {
    box: ''
  };

  async componentDidMount() {
    this.subscribeToNewFile();
    const box = this.props.match.params.id;
    const response = await api.get(`/boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFile = () => {
    const box = this.props.match.params.id;
    const io = socket('https://omniweek.herokuapp.com');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpdate = files => {
    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      api.post(`/boxes/${this.state.box._id}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <DropZone onDropAccepted={this.handleUpdate}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </DropZone>
        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url}>
                  <MdInsertDriveFile size={24} color="A5Cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{' '}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
