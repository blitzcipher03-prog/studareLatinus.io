const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Service</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background-color: #8B0000;
    }
    .top-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background-color: #FFA500;
      border: 1px solid #000000;
      box-sizing: border-box;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .top-bar-text {
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background-color: #FFD700;
      border: 1px solid #000000;
      box-sizing: border-box;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
    }
    .ticker-text {
      display: inline-block;
      font-family: 'Constantia', 'Georgia', serif;
      font-size: 16px;
      font-weight: bold;
      color: #000000;
      white-space: nowrap;
    }
    .ticker-text.animate {
      animation: ticker 10s linear forwards;
    }
    @keyframes ticker {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100vw); }
    }
    .bottom-bar-text {
      font-family: 'Constantia', 'Georgia', serif;
      font-size: 16px;
      font-weight: bold;
      color: #000000;
    }
    .breaking-news {
      position: fixed;
      bottom: 35px;
      left: 5px;
      font-family: 'Constantia', 'Georgia', serif;
      font-size: 18px;
      font-weight: bold;
      color: #FFD700;
      z-index: 2;
    }
    .title, .subtitle, .img-container {
      z-index: 2;
    }
    .top-right-img {
      width: 150px;
      height: 150px;
      border: 2px solid #ffffff;
    }
    .img-container {
      position: fixed;
      top: 35px;
      right: 8px;
      display: flex;
    }
    .title {
      position: fixed;
      top: 35px;
      left: 5px;
      font-family: 'Times New Roman', serif;
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
    .subtitle {
      position: fixed;
      top: 65px;
      left: 5px;
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      font-style: italic;
      color: white;
    }
    .subjects img {
      width: 190px;
      height: 65px;
    }
    .subject-btn {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .back-btn {
      position: fixed;
      top: 70px;
      left: 5px;
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      color: #4DA6FF;
      text-decoration: underline;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .back-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .l1-content {
      position: fixed;
      top: 135px;
      left: 5px;
    }
    .l1-section {
      font-family: 'Times New Roman', serif;
      font-size: 23px;
      font-weight: bold;
      color: white;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    .l1-row {
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      color: white;
      margin: 3px 0 3px 10px;
    }
    .l1-elbow {
      display: inline-block;
      width: 10px;
      height: 9px;
      border-left: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      margin-right: 4px;
      margin-bottom: 1px;
    }
    .l1-row a {
      color: #4DA6FF;
      text-decoration: none;
      word-break: break-all;
    }
    .l1-row a:hover {
      text-decoration: underline;
    }
    .l2-message {
      position: fixed;
      top: 35px;
      left: 5px;
      font-family: 'Times New Roman', serif;
      font-size: 18px;
      color: white;
    }
    .subjects {
      position: fixed;
      top: 120px;
      left: 5px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-family: 'Times New Roman', serif;
      font-size: 28px;
      font-weight: bold;
      color: #0000EE;
    }
    .resources-block {
      position: fixed;
      top: 275px;
      left: 5px;
      z-index: 2;
    }
    .other-resources {
      font-family: 'Times New Roman', serif;
      font-size: 23px;
      font-weight: bold;
      color: white;
    }
    .resource-row {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
    .ref-message {
      font-family: Arial, sans-serif;
      font-style: italic;
      font-size: 15px;
      color: white;
      max-width: 340px;
      margin-top: 8px;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .elbow {
      width: 10px;
      height: 9px;
      border-left: 1px solid white;
      border-bottom: 1px solid white;
      margin-bottom: 4px;
    }
    .resource-link {
      margin-left: 4px;
      font-family: 'Times New Roman', serif;
      font-size: 16px;
      color: #4DA6FF;
    }
    .hover-text {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      font-family: 'Times New Roman', serif;
      font-size: 18px;
      font-weight: bold;
      color: white;
      max-width: 200px;
      text-align: right;
      padding: 0 5px;
    }
    .img-container a:hover + .hover-text {
      display: block;
    }
    .suggestions-toggle {
      position: fixed;
      right: 8px;
      bottom: 38px;
      z-index: 10;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .suggestions-toggle img {
      display: block;
      width: 149px;
      height: 49px;
    }
    .suggestions-panel {
      position: fixed;
      display: none;
      right: 8px;
      bottom: 100px;
      width: 300px;
      height: 250px;
      background: #f0e9dd;
      border: 2px solid #000000;
      padding: 14px;
      box-sizing: border-box;
      z-index: 10;
      font-family: 'Times New Roman', serif;
      overflow-y: auto;
    }
    .suggestions-panel.open {
      display: block;
    }
    .suggestions-panel h3 {
      margin-top: 0;
    }
    .suggestions-panel textarea {
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      resize: vertical;
      font-family: 'Times New Roman', serif;
      font-size: 14px;
    }
    .suggestions-panel .submit-btn {
      margin-top: 8px;
      font-family: 'Times New Roman', serif;
      font-size: 15px;
      font-weight: bold;
      padding: 6px 14px;
      cursor: pointer;
      background: #8B0000;
      color: white;
      border: 1px solid black;
    }
    .suggestions-panel .tip {
      font-size: 13px;
      color: #555;
      margin-top: -4px;
    }
    .suggestions-status {
      margin-top: 8px;
      font-weight: bold;
    }
    .admin-view-btn {
      position: fixed;
      top: 200px;
      right: 8px;
      z-index: 5;
      font-family: 'Times New Roman', serif;
      font-size: 14px;
      font-weight: bold;
      color: white;
      background: #8B0000;
      border: 2px solid #ffffff;
      padding: 6px 10px;
      cursor: pointer;
    }
    .admin-content {
      position: fixed;
      top: 90px;
      left: 5px;
      right: 5px;
      bottom: 60px;
      overflow-y: auto;
      padding-right: 8px;
    }
    .sug {
      background: #f0e9dd;
      border: 2px solid #000000;
      padding: 10px 14px;
      margin: 10px 0;
    }
    .sug .date {
      font-size: 12px;
      color: #888;
      margin-bottom: 4px;
    }
    .sug .text {
      font-size: 16px;
      color: #222;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .sug .del {
      margin-top: 6px;
      font-family: 'Times New Roman', serif;
      font-size: 13px;
      cursor: pointer;
      background: #8B0000;
      color: white;
      border: 1px solid black;
      padding: 3px 10px;
    }
    .empty {
      color: #ccc;
      font-style: italic;
    }
    .sug-count {
      font-size: 14px;
      font-weight: normal;
      color: #ddd;
    }
  </style>
</head>
<body>
  <div class="top-bar"><span class="top-bar-text">Created by Ben V and Ethan M</span></div>
  <div class="bottom-bar"><span class="ticker-text" id="ticker-text"></span></div>
  <div class="breaking-news">BREAKING NEWS!</div>

  <button class="suggestions-toggle" onclick="toggleSuggestions()"><img src="/3.png" alt="Suggestions"></button>
  <div class="suggestions-panel" id="suggestions-panel">
    <h3>Suggest Additions:</h3>
    <textarea id="suggest-text" placeholder="Type your suggestion here..."></textarea>
    <button class="submit-btn" onclick="submitSuggestion()">Submit</button>
    <div class="suggestions-status" id="suggest-status"></div>
  </div>

  <div id="main-page">
    <div class="title">Latin I and II Study Materials</div>
    <div class="subtitle">"Ad Astra Per Aspera"</div>
    <div class="subjects">
      <button class="subject-btn" onclick="showLatin1()"><img src="/1.png" alt="Latin I"></button>
      <button class="subject-btn" onclick="showLatin2()"><img src="/2.png" alt="Latin II"></button>
    </div>
    <div class="resources-block">
      <div class="other-resources">Other Resources:</div>
      <div class="resource-row">
        <span class="elbow"></span>
        <a class="resource-link" href="https://hcmc.uvic.ca/project/latin/wheelock/contents.htm" target="_blank">https://hcmc.uvic.ca/project/latin/wheelock/contents.htm</a>
      </div>
      <div class="resource-row">
        <span class="elbow"></span>
        <a class="resource-link" href="https://www.youtube.com/playlist?list=PLbkEjA_heZ8mpmDtMz3wRU9_WLcL0qezt" target="_blank">https://www.youtube.com/playlist?list=PLbkEjA_heZ8mpmDtMz3wRU9_WLcL0qezt</a>
      </div>
      <div class="ref-message">“Hey everyone! I’ve compiled a list of study materials from vocabulary quizlets to some extra tables practice and listed them below. I made most of them (based on class requests), but some of them are useful links to YouTube videos or resources that can be found online. I hope that these study guides are useful!! This is a work in progress, so some things may be missing for now. If you have suggestions or ideas for other materials that I can make to help you, feel free to message me and I’ll make sure that it’s created for you. Happy studying!! :)” -EM</div>
      <div class="ref-message">“Hello users of this I created the website!” - BV</div>
    </div>
    <div class="img-container">
      <a href="http://www.wheelockslatin.com" target="_blank">
        <img class="top-right-img" src="https://m.media-amazon.com/images/I/81jFHGwiV6L._AC_UF1000,1000_QL80_.jpg" alt="Wheelock's Latin">
      </a>
      <div class="hover-text">This is study material based of Wheelock's Latin, you can visit their website by clicking on the image!</div>
    </div>
    <!--ADMIN_BTN-->
  </div>

  <div id="latin1-page" style="display:none">
    <div class="title">Latin I Materials</div>
    <button class="back-btn" onclick="showMain()">← Back</button>
    <div class="l1-content">
      <div class="l1-section">Vocabulary Study Guides:</div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 1: <a href="https://quizlet.com/1161808671/wheelock-chapter-1-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161808671/wheelock-chapter-1-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 2: <a href="https://quizlet.com/1161809115/wheelock-chapter-2-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161809115/wheelock-chapter-2-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 3: <a href="https://quizlet.com/1161809577/wheelock-chapter-3-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161809577/wheelock-chapter-3-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 4: <a href="https://quizlet.com/1161810010/wheelock-chapter-4-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161810010/wheelock-chapter-4-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 5: <a href="https://quizlet.com/1161811148/wheelock-chapter-5-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161811148/wheelock-chapter-5-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 6: <a href="https://quizlet.com/1161811525/wheelock-chapter-6-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161811525/wheelock-chapter-6-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 7: <a href="https://quizlet.com/1161812085/wheelock-chapter-7-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161812085/wheelock-chapter-7-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 8: <a href="https://quizlet.com/1161813210/wheelock-chapter-8-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161813210/wheelock-chapter-8-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 9: <a href="https://quizlet.com/1161813899/wheelock-chapter-9-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161813899/wheelock-chapter-9-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 10: <a href="https://quizlet.com/1161814246/wheelock-chapter-10-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161814246/wheelock-chapter-10-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 11: <a href="https://quizlet.com/1161815292/wheelock-chapter-11-vocab-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161815292/wheelock-chapter-11-vocab-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 12: <a href="https://quizlet.com/1161795183/chapter-12-vocabulary-grammar-questions-and-extra-info-flash-cards/?funnelUUID=7fe3dcec-8aca-4df6-9e48-4427771b206c" target="_blank">https://quizlet.com/1161795183/chapter-12-vocabulary-grammar-questions-and-extra-info-flash-cards/?funnelUUID=7fe3dcec-8aca-4df6-9e48-4427771b206c</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Chapter 13: <a href="https://quizlet.com/1172048865/chapter-13-vocab-study-guide-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1172048865/chapter-13-vocab-study-guide-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-section">Demonstratives Study Guides:</div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Demonstrative Pronouns (1st, 2nd, 3rd Persons): <a href="https://quizlet.com/1161826819/demonstrative-pronouns-1st-2nd-3rd-persons-study-guide-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161826819/demonstrative-pronouns-1st-2nd-3rd-persons-study-guide-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Demonstrative Adjectives (Hic Haec Hoc and Ille Illa Illud): <a href="https://quizlet.com/1161828583/demonstrative-adjectives-practice-parse-to-cng-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161828583/demonstrative-adjectives-practice-parse-to-cng-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-section">Adjectives Study Guides:</div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Special Adjectives (Naughty Nine): <a href="https://quizlet.com/1161816712/special-adjectives-study-guide-naughty-9-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161816712/special-adjectives-study-guide-naughty-9-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-section">Verbs Study Guides:</div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Verb Endings (Latin to English Translation Practice): <a href="https://quizlet.com/1161834866/verb-endings-latin-to-english-translation-practice-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161834866/verb-endings-latin-to-english-translation-practice-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Verb Endings Study Guide: 1st &amp; 2nd Conjugation Active Indicative Future Endings: <a href="https://quizlet.com/1161835995/verb-endings-study-guide-1st-2nd-conj-active-indicative-future-endings-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161835995/verb-endings-study-guide-1st-2nd-conj-active-indicative-future-endings-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Verb Endings: Third Conjugation Plural Verb Endings: <a href="https://quizlet.com/1161836707/verb-endings-third-conjugation-plural-verb-endings-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161836707/verb-endings-third-conjugation-plural-verb-endings-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-section">Nouns Study Guides:</div>
      <div class="l1-row">
        <span class="l1-elbow"></span>Cases Practice/Sentence Context Practice: <a href="https://quizlet.com/1161837728/noun-endingscases-practice-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161837728/noun-endingscases-practice-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>1st Declension Noun Endings: <a href="https://quizlet.com/1161838886/first-declension-noun-endings-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161838886/first-declension-noun-endings-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>2nd Declension Noun Endings (Masculine): <a href="https://quizlet.com/1161839383/2nd-declension-masculine-noun-endings-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161839383/2nd-declension-masculine-noun-endings-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>2nd Declension Noun Endings (Neuter): <a href="https://quizlet.com/1161839885/2nd-declension-neuter-noun-endings-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161839885/2nd-declension-neuter-noun-endings-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>3rd Declension Noun Endings (Feminine &amp; Masculine): <a href="https://quizlet.com/1161840427/3rd-declension-noun-endings-feminine-masculine-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161840427/3rd-declension-noun-endings-feminine-masculine-flash-cards/?i=6qebdt&x=1jqt</a></div>
      <div class="l1-row">
        <span class="l1-elbow"></span>3rd Declension Noun Endings (Neuter): <a href="https://quizlet.com/1161841918/3rd-declension-noun-endings-neuter-flash-cards/?i=6qebdt&x=1jqt" target="_blank">https://quizlet.com/1161841918/3rd-declension-noun-endings-neuter-flash-cards/?i=6qebdt&x=1jqt</a></div>
    </div>
  </div>
  <div id="latin2-page" style="display:none">
    <button class="back-btn" style="top: 70px" onclick="showMain()">← Back</button>
    <div class="l2-message">Nothing yet sorry :( - BV</div>
  </div>

  <div id="admin-page" style="display:none">
    <div class="title">Suggestions <span class="sug-count" id="sug-count"></span></div>
    <button class="back-btn" onclick="showMain()">← Back</button>
    <div class="admin-content" id="sug-list"></div>
  </div>
<script>
  // Add your news messages to this list — one is chosen at random every 10
  // seconds and scrolls across the gold bar.
  const newsList = [
    'Romulus of Alba Longa has just founded Rome after brief disagreement with brother. Experts say the city will fall to the Carthaginians.',
    'Mass hysteria as new verb conjugation test is announced to the public.',
    'Incoming sophomores state that the suprise addition of a new classical literacy packet in the middle of summer is, "Very inconvienent".',
    'The newer generation is now calling "Discus" the new sport-of-the-century.'
  ];
  const tickerEl = document.getElementById('ticker-text');

  function runNext() {
    tickerEl.style.visibility = 'visible';
    tickerEl.textContent =
      newsList[Math.floor(Math.random() * newsList.length)];
    // Restart the scroll animation with the new message
    tickerEl.classList.remove('animate');
    void tickerEl.offsetWidth;
    tickerEl.classList.add('animate');
    // After the 10s scroll finishes, wait 25s before showing the next one
    setTimeout(function () {
      tickerEl.style.visibility = 'hidden';
      setTimeout(runNext, 25000);
    }, 10000);
  }

  runNext();

  // --- Page switching (looks like navigating, but stays on one page) ---
  function showLatin1() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('latin1-page').style.display = 'block';
  }

  function showLatin2() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('latin2-page').style.display = 'block';
  }

  function showMain() {
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('latin1-page').style.display = 'none';
    document.getElementById('latin2-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';
  }

  function showAdmin() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('latin1-page').style.display = 'none';
    document.getElementById('latin2-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'block';
    loadSuggestions();
  }

  function loadSuggestions() {
    var listEl = document.getElementById('sug-list');
    listEl.innerHTML = 'Loading...';
    fetch('/api/suggestions')
      .then(function (r) {
        if (!r.ok) throw new Error('Forbidden');
        return r.json();
      })
      .then(function (list) {
        document.getElementById('sug-count').textContent = '(' + list.length + ' total)';
        listEl.innerHTML = '';
        if (!list.length) {
          listEl.innerHTML = '<p class="empty">No suggestions yet.</p>';
          return;
        }
        for (var i = list.length - 1; i >= 0; i--) {
          var s = list[i];
          var div = document.createElement('div');
          div.className = 'sug';
          var d = document.createElement('div');
          d.className = 'date';
          d.textContent = new Date(s.date).toLocaleString();
          var t = document.createElement('div');
          t.className = 'text';
          t.textContent = s.text;
          var b = document.createElement('button');
          b.className = 'del';
          b.textContent = 'Delete';
          b.onclick = (function (i) { return function () { delSug(i); }; })(i);
          div.appendChild(d);
          div.appendChild(t);
          div.appendChild(b);
          listEl.appendChild(div);
        }
      })
      .catch(function () {
        listEl.innerHTML = '<p class="empty">Could not load suggestions.</p>';
      });
  }

  function delSug(id) {
    if (!confirm('Delete this suggestion?')) return;
    fetch('/api/suggestions?id=' + id, { method: 'DELETE' })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.ok) loadSuggestions(); });
  }
</script>
<script>
  // --- Suggestions sidebar ---
  function toggleSuggestions() {
    document.getElementById('suggestions-panel').classList.toggle('open');
  }

  function submitSuggestion() {
    var textEl = document.getElementById('suggest-text');
    var statusEl = document.getElementById('suggest-status');
    var text = textEl.value.trim();
    if (!text) {
      statusEl.textContent = 'Please write something first!';
      statusEl.style.color = '#b00';
      return;
    }
    fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) {
          textEl.value = '';
          statusEl.textContent = 'Thanks! Suggestion submitted anonymously.';
          statusEl.style.color = '#080';
        } else {
          statusEl.textContent = 'Something went wrong. Try again.';
          statusEl.style.color = '#b00';
        }
      })
      .catch(function () {
        statusEl.textContent = 'Network error — try again.';
        statusEl.style.color = '#b00';
      });
  }
</script>
</body>
</html>`;

const OWNER_IP = '67.181.167.48';                                       // your current public IP
// Override without editing code: set env var OWNER_IPS, e.g. "1.2.3.4,5.6.7.8"
const OWNER_IPS = (process.env.OWNER_IPS || OWNER_IP).split(',').map(function (s) { return s.trim(); });
// Secret for automatic IP updates: visit /?owner=TOKEN from the device that
// will use the admin view, and it saves that device's public IP as an owner IP.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me-to-a-long-random-string';
const SUGGESTIONS_FILE = path.join(__dirname, 'suggestions.json');
const OWNER_IPS_FILE = path.join(__dirname, 'owner-ips.json');
// Restore previously saved owner IPs (from /?owner=TOKEN visits)
try {
  const saved = JSON.parse(fs.readFileSync(OWNER_IPS_FILE, 'utf8'));
  if (saved && saved.ips) {
    saved.ips.forEach(function (i) { if (OWNER_IPS.indexOf(i) === -1) OWNER_IPS.push(i); });
  }
} catch (e) { /* no saved file yet */ }
const ADMIN_BTN = '<button class="admin-view-btn" onclick="showAdmin()">Admin - View/Delete Suggestions</button>';

function isAllowed(req) {
  // Behind a reverse proxy (Render/Railway), the real client IP is the first
  // entry of X-Forwarded-For; otherwise use the socket address.
  const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = xff || req.socket.remoteAddress || '';
  return ip === '' || OWNER_IPS.indexOf(ip) !== -1 || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function readSuggestions() {
  try {
    return JSON.parse(fs.readFileSync(SUGGESTIONS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  const qs = new URLSearchParams((req.url || '').split('?')[1] || '');

  // Owner IP auto-update: visit /?owner=TOKEN and this machine's public IP
  // is recorded as an owner IP (handy when your IP changes).
  if (qs.get('owner') && qs.get('owner') === ADMIN_TOKEN) {
    const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = xff || req.socket.remoteAddress || '';
    if (ip && OWNER_IPS.indexOf(ip) === -1) {
      OWNER_IPS.push(ip);
      fs.writeFile(OWNER_IPS_FILE, JSON.stringify({ ips: OWNER_IPS, updated: new Date().toISOString() }, null, 2), () => {});
    }
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // Public: accept a suggestion (anonymous)
  if (url === '/api/suggestions' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let data = {};
      try { data = JSON.parse(body); } catch (e) { /* ignore */ }
      const text = String(data.text || '').trim();
      if (!text) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"ok":false}');
        return;
      }
      const list = readSuggestions();
      list.push({ text: text, date: new Date().toISOString() });
      fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(list, null, 2), () => {});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
    return;
  }

  // Owner-only: list suggestions
  if (url === '/api/suggestions' && req.method === 'GET') {
    if (!isAllowed(req)) { res.writeHead(403); res.end('Forbidden'); return; }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(readSuggestions()));
    return;
  }

  // Owner-only: delete a suggestion by index
  if (url === '/api/suggestions' && req.method === 'DELETE') {
    if (!isAllowed(req)) { res.writeHead(403); res.end('Forbidden'); return; }
    const q = new URLSearchParams((req.url || '').split('?')[1] || '');
    const id = parseInt(q.get('id'), 10);
    const list = readSuggestions();
    if (isNaN(id) || id < 0 || id >= list.length) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"ok":false}');
      return;
    }
    list.splice(id, 1);
    fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(list, null, 2), () => {});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
    return;
  }

  if (url !== '/') {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
      res.end(data);
    });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(HTML.replace('<!--ADMIN_BTN-->', isAllowed(req) ? ADMIN_BTN : ''));
});

server.listen(process.env.PORT || PORT, () => {
  console.log(`Web service running at http://localhost:${PORT}`);
});