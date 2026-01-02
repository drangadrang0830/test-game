function doGet(e) {
  const params = e.parameter;
  const action = params.action;

  if (action === 'getQuestions') {
    return getQuestions(params.count);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'submitScore') {
      return submitScore(data);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get N random questions from '題目' sheet
 * Columns: [No, Question, A, B, C, D, Answer]
 * Returns: [{id, question, options: {A, B, C, D}}] (No Answer)
 */
function getQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('題目');
  // Assume Row 1 is header
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  if (rows.length === 0) {
    return json({ questions: [] });
  }

  // Shuffle and slice
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count || 5);

  const formatted = selected.map(row => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    }
  }));

  return json({ questions: formatted });
}

/**
 * Calculate Score and Record to '回答' sheet
 * Payload: { userId, answers: [{id, selection}] }
 * Grading: Compares with '題目' sheet.
 */
function submitScore(payload) {
  const userId = payload.userId;
  const userAnswers = payload.answers || []; // [{id: 1, selection: 'A'}]
  
  if (!userId) return json({ error: 'Missing UserId' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Calculate Score
  const qSheet = ss.getSheetByName('題目');
  const qData = qSheet.getDataRange().getValues();
  // Map QuestionID -> CorrectAnswer (Column Index 6 -> G)
  // [No, Q, A, B, C, D, Ans]
  // Map QuestionID -> Row Data
  const qMap = new Map();
  qData.slice(1).forEach(row => {
    qMap.set(String(row[0]), {
      text: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      },
      answerKey: String(row[6]).trim().toUpperCase()
    });
  });

  let correctCount = 0;
  const review = [];
  
  userAnswers.forEach(ans => {
    const q = qMap.get(String(ans.id));
    if (q) {
      const userSelection = String(ans.selection).trim().toUpperCase();
      const isCorrect = q.answerKey === userSelection;
      
      if (isCorrect) correctCount++;
      
      review.push({
        id: ans.id,
        question: q.text,
        yourSelection: userSelection,
        correctSelection: q.answerKey,
        yourAnswerText: q.options[userSelection] || '',
        correctAnswerText: q.options[q.answerKey] || '',
        isCorrect: isCorrect
      });
    }
  });
  
  // Score can be just count for now, or percentage. 
  // Requirement says "總分" (Total Score). Let's imply 100 points scale or just count.
  // Let's use Count for simple logic, or Count * 10. Let's stick to Correct Count for score.
  const score = correctCount; 

  // 2. Record to '回答' sheet
  // Columns: [ID, PlayCount, TotalScore, HighScore, FirstClearScore, AttemptsToFirstClear, LastPlayedDate]
  const aSheet = ss.getSheetByName('回答');
  const lastRow = aSheet.getLastRow();
  let aData = [];
  if (lastRow > 1) {
    aData = aSheet.getRange(2, 1, lastRow - 1, 7).getValues();
  }

  let rowIndex = -1;
  let userRecord = null;
  
  for (let i = 0; i < aData.length; i++) {
    if (String(aData[i][0]) === String(userId)) {
      rowIndex = i;
      userRecord = aData[i];
      break;
    }
  }

  const now = new Date();
  const passed = payload.passed === true; // Client tells us if they passed threshold? Or we decide?
  // Ideally Server decides, but Threshold is env var on client? 
  // Let's assume ANY finished game counts as a play found.
  // "First Clear Score" implies we need to know if they cleared.
  // Let's accept 'passed' flag from client, OR assume a fixed threshold.
  // Given the 'passed' logic might be complex with .env, I'll rely on Client sending `passed: true/false` or handle it blindly.
  // BETTER: Client sends `passed` boolean based on its .env check. Trust the client for this demo.
  
  const isPassed = payload.passed === true; 

  if (userRecord) {
    // Update Existing
    // [0] ID, [1] Count, [2] TotalScore, [3] HighScore, [4] FirstClear, [5] AttemptsToClear, [6] Date
    let playCount = Number(userRecord[1]) || 0;
    let totalScore = Number(userRecord[2]) || 0;
    let highScore = Number(userRecord[3]) || 0;
    let firstClear = userRecord[4]; // Can be string/number or empty
    let attemptsToClear = userRecord[5];

    playCount += 1;
    totalScore += score; // Accumulate
    if (score > highScore) highScore = score;
    
    // First Clear Logic
    if (isPassed && (firstClear === '' || firstClear === undefined || firstClear === null)) {
      firstClear = score;
      attemptsToClear = playCount;
    }

    // Update Row (rowIndex + 2 because of header and 0-index)
    // Range: Row, Column, NumRows, NumColumns
    const range = aSheet.getRange(rowIndex + 2, 1, 1, 7);
    range.setValues([[userId, playCount, totalScore, highScore, firstClear, attemptsToClear, now]]);
    
  } else {
    // Create New
    const playCount = 1;
    const totalScore = score;
    const highScore = score;
    let firstClear = '';
    let attemptsToClear = '';
    
    if (isPassed) {
      firstClear = score;
      attemptsToClear = 1;
    }
    
    aSheet.appendRow([userId, playCount, totalScore, highScore, firstClear, attemptsToClear, now]);
  }

  return json({ 
    success: true, 
    score: score, 
    correctCount: correctCount,
    review: review 
  });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
