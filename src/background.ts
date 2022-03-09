import { CONFIG } from './config';
import { get, post } from './util/api';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ config: CONFIG });
  console.log(`Default config set`);

  // const contextTypes = [
  //   'all',
  //   'page',
  //   'frame',
  //   'selection',
  //   'link',
  //   'editable',
  //   'image',
  //   'video',
  //   'audio',
  //   'launcher',
  //   'browser_action',
  //   'page_action',
  //   'action',
  // ];

  // const itemTypes = ['normal', 'checkbox', 'radio', 'separator'];

  // chrome.contextMenus.create({
  //   id: 'sampleContextMenu',
  //   title: 'Sample Context Menu',
  //   contexts: ['selection'],
  //   type: 'normal',
  // });
});

const urlFilters: { url: chrome.events.UrlFilter[] } = {
  url: [
    // { hostContains: 'google.com', urlContains: 'google.com' },
    // { hostContains: 'artgrid.io', urlContains: 'artgrid.io' },
    { urlMatches: 'https://artgrid.io' },
    { urlMatches: 'https://google.com' },
  ],
};

const onPageLoaded = (event: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  console.log('onPageLoaded -> event', event);
  console.info('Loaded filter url', event.url);

  chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
    if (!id) {
      return;
    }

    console.log('tab with filtered url detected', id);
    // chrome.pageAction.show(id);
  });
};

chrome.webNavigation.onCompleted.addListener(onPageLoaded, urlFilters);

function changePageColor(color: string) {
  document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener(async (tab) => {
  console.log('onClicked');
  await chrome.action.setTitle({ tabId: tab.id, title: `You are on tab:${tab.id}` });

  if (!tab.id) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (color) => changePageColor,
    args: ['red'],
  });
});

type RuntimeMessageData = {
  [key: string]: any;
};

type RuntimeMessage = {
  type: string;
  data: RuntimeMessageData;
};

const MESSAGE_HANDLERS = {
  test: async (data: RuntimeMessageData) => {
    return 'test';
  },
  testFetch: async (data: RuntimeMessageData) => {
    // const response = await post('https://example.com/answer', { name: 'test' });
    const response = await get('https://api.sampleapis.com/switch/games');
    return response;
  },
};

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  console.log('runtime.onMessage');
  console.log('message', message);
  console.log('sender', sender);

  const messageTypes = Object.getOwnPropertyNames(MESSAGE_HANDLERS);

  if (!messageTypes.includes(message.type)) {
    console.log('Unknown message type');
    return false;
  }

  const messageHandler = MESSAGE_HANDLERS[message.type as keyof typeof MESSAGE_HANDLERS];

  messageHandler(message.data)
    .then((data: RuntimeMessageData) => sendResponse(data))
    .catch((error) => sendResponse(null));

  // return Promise.resolve('done');

  return true;
});
