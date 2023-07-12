import Spinner from "react-bootstrap/Spinner";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload, faFile } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import "bootstrap/dist/css/bootstrap.css";
import FadeLoader from "react-spinners/FadeLoader";
import { PDFDownloadLink, Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import "./App.css";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 6,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
  },
  text: {
    marginBottom: 10,
    fontSize: 6,
  },
});
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [highlightedText, setHighlightedText] = useState("");
  const [wordCounts, setWordCounts] = useState({});
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [outputPDFFfileName__, setOutputPDFFfileName__] = useState("");

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);

    if (!file) {
      setShowLoadingScreen(false);
      return alert("Please choose file to upload !!");
    }
    try {
      setShowLoadingScreen(true);
      const response = await axios.post(process.env.REACT_APP_API_URL + "/api/upload", formData);
      setShowLoadingScreen(false);
      const { highlightedText: responseHighlightedText, wordCounts: responseWordCounts, filename } = response.data;

      let outputPDFFfileName = filename;
      const fileNameParts = outputPDFFfileName.split(".");
      fileNameParts.pop();
      setOutputPDFFfileName__(`${fileNameParts.join(".")}_phrases_found.pdf`);

      setHighlightedText(responseHighlightedText);
      setWordCounts(responseWordCounts);
    } catch (error) {
      console.error("Error uploading file:", error);
      setShowLoadingScreen(false);
      error = "This file not support";
      alert(error);
    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Html style={{ fontSize: "12px", fontFamily: "Times New Roman" }}>{highlightedText}</Html>
        </View>
      </Page>
    </Document>
  );

  const handleClearDocument = () => {
    setShowLoadingScreen(true);

    setHighlightedText("");
    setWordCounts("");
    setFile(null);
    setShowLoadingScreen(false);
  };

  const loadingScreen = () => {
    return (
      <div
        className="d-flex display-5 justify-content-center align-items-center"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: "10",
          backgroundColor: "#0006",
        }}
      >
        <div className="text-light">
          {/* Loading
          <Spinner className="ms-3" animation="border" role="status"> */}
          <FadeLoader color="darkorange" />
          {/* </Spinner> */}
        </div>
      </div>
    );
  };

  const colors = [
    "#FF0000",
    "#0000FF",
    "#FF00FF",
    "#808000",
    "#FFA500",
    "#000000",
    "#808080",
    "#3CB371",
    "#57E964",
    "#FDBD01",
    "#D4A017",
    "#513B1C",
    "#EB5406",
    "#F62217",
    "#810541",
    "#F8B88B",
    "#FF00FF",
    "#BA55D3",
    "#800080",
  ];
  const wordMatchColor = {};
  let nextMatchColor = 0;

  const textStyle = {
    textAlign: "center",
    color: "#000c",
    fontSize: "50px",
    fontFamily: "'Exo', sans-serif",
  };

  return (
    <div>
      {showLoadingScreen && loadingScreen()}

      <div className="animationContainer">
        <div className="app">
          <div className="container display-4 text-center pt-5 pb-3" style={textStyle}>
            Torture Phrases Tool
          </div>

          <div className="row pt-5 justify-content-center" style={{ transition: "all .3s" }}>
            <div className="mb-5  col-lg-4">
              <div className="parent me-3">
                <div className=" file-upload mx-auto">
                  <div>
                    <h3>
                      <CSSTransition in={true} appear={true} timeout={500} classNames="animation">
                        <FontAwesomeIcon icon={faFile} className="file-icon" />
                      </CSSTransition>
                      &nbsp; Choose Browse File from Device
                    </h3>
                    <input type="file" accept=".doc,.docx" onChange={handleFileUpload} required />
                  </div>
                </div>{" "}
                &nbsp; &nbsp;
                <button onClick={handleSubmit} className="upload-button btn-block w-100">
                  <FontAwesomeIcon icon={faUpload} />
                  Upload
                </button>
                <div style={{ cursor: "pointer" }} onClick={handleClearDocument} className="text-danger p-0 bg-transparent mt-4 text-end">
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Clear Document
                </div>
              </div>
            </div>

            {highlightedText && (
              <div className=" mb-5 col-lg-6 parent m-0">
                <div className="mx-auto ">
                  {highlightedText && Object.keys(wordCounts).length === 0 && (
                    <div>
                      <h1>No matched torture phrases found.</h1>
                    </div>
                  )}

                  {Object.keys(wordCounts).length > 0 && (
                    <div>
                      <h1>Torture Phrases Found:</h1>
                      <ul>
                        {Object.entries(wordCounts).map(([word, count]) => {
                          if (!wordMatchColor[word]) {
                            wordMatchColor[word] = colors[nextMatchColor];
                            nextMatchColor++;
                            if (nextMatchColor === colors.length) {
                              nextMatchColor = 0;
                            }
                          }
                          return (
                            <li style={{ color: wordMatchColor[word] }} key={word}>
                              {word}: {count}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {highlightedText && (
                    <div>
                      <PDFDownloadLink className="btn btn-danger" document={<MyDocument />} fileName={outputPDFFfileName__}>
                        {({ loading }) => (loading ? "Loading document..." : "Download as PDF")}
                      </PDFDownloadLink>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
