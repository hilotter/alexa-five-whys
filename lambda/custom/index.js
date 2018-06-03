/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const readQuestionCounter = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
   if(!attributes.counter){ 
      attributes.counter = 1;
  }
  const counter = attributes.counter;

  attributes.counter++;
  handlerInput.attributesManager.setSessionAttributes(attributes);

  return counter;
}

const resetQuestionCounter = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  attributes.counter = null;
  handlerInput.attributesManager.setSessionAttributes(attributes);
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = '5回のなぜへようこそ。相談したい内容を話してください。';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const WhyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhyIntent';
  },
  handle(handlerInput) {
    const counter = readQuestionCounter(handlerInput);
    const text = handlerInput.requestEnvelope.request.intent.slots['text'].value;
    let speechText;

    if (counter == 6) {
      speechText = '問題の本当の原因にたどり着くことはできましたか？終了する場合は、「ストップ」と言ってください。続ける場合は、そのまま分析を続けてください。';
    } else {
      speechText = 'なぜですか？';
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = '分析したい問題を私に相談してみてください';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'またいつでも相談してください！';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    resetQuestionCounter(handlerInput);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('すみません。内容が理解できませんでした。もう一度お願いします。')
      .reprompt('すみません。内容が理解できませんでした。もう一度お願いします。')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    WhyIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
