import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import {Amplify} from 'aws-amplify';
import aws_exports from './aws-exports';
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import { Storage } from 'aws-amplify';
import { useEffect, useRef, useState } from 'react';

Amplify.configure(aws_exports);


function App() {
  const ref = useRef(null);
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState();



  const loadImages = () => {
    Storage.list("")
      .then((files) => {
        console.log(files);
        setFiles(files);
      })
      .catch((err) => {
        console.log(err);
      });    
  }

  useEffect(() => {
    loadImages();
   }, []);

  const handleFileLoad = () => {
    const filename = ref.current.files[0].name;
    Storage.put(filename, ref.current.files[0], {
      progressCallback: (progress) => {
        setProgress(Math.round((progress.loaded / progress.total) * 100) + "%");
        setTimeout(() => { setProgress() }, 1000);
      }
    })
      .then(resp => {
      console.log(resp);
      loadImages();
    }).catch(err => {console.log(err);});
  }

  const handleShow = (file) => {
    Storage.get(file).then(resp => {
      console.log(resp);
      setImage(resp)
    }).catch(err => { console.log(err); });
  }

  const handleDelete = (file) => {
    Storage.remove(file).then(resp => {
      console.log(resp);
      loadImages();
     }).catch(err => { console.log(err); });
  }
 return (
      <div className="App">
        <AmplifySignOut />
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {/* <AmplifyS3Image imgKey="example.jpeg" /> */}
          <h1>React AWS Storage Demo</h1>
        <input ref={ref} type="file" onChange={handleFileLoad} />
        { progress}
        <table>
          <thead>
            <tr>
              <td></td>
              <td>Name</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {files.map((file,i) => (
              <tr key={file.key}>
                <td>{i}</td>
                <td>{file.key}</td>
                <td>
                  <button onClick={() => handleShow(file.key)}>Show</button>
                  <button onClick={() => handleDelete(file.key)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <img src={image} width="600"/>
        </header>
      </div>
    );
  }


export default withAuthenticator(App);