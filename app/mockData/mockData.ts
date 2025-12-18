export const mockMessages = [
  {
    id: '1',                            // 消息的唯一ID
    role: 'user',                        // 角色是 'user'
    parts: [
      { type: 'text', content: 'Hello! How are you?' }  // 用户消息内容
    ]
  },
  {
    id: '2',                            // 消息的唯一ID
    role: 'assistant',                   // 角色是 'assistant'
    parts: [
      { type: 'text', content: 'I am doing great! How can I assist you today?' }  // 助手回复
    ]
  },
  {
    id: '3',                            // 消息的唯一ID
    role: 'user',                        // 角色是 'user'
    parts: [
      { type: 'text', content: '你好' }  // 用户消息内容
    ]
  },
  {
    id: '4',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Sure! Here is an image of a cat:\n\n![Cat Image](https://placekitten.com/400/300)\n\nIsn\'t it cute?'
      }
    ]
  },
  {
    id: '5',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a table with some sample data?' }
    ]
  },
  {
    id: '6',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Of course! Here\'s a sample table with fictional data:\n\n| Name | Age | Occupation | Country |\n|------|-----|------------|---------|\n| Alice Johnson | 28 | Software Engineer | USA |\n| Bob Smith | 35 | Designer | Canada |\n| Clara Davis | 42 | Marketing Manager | UK |\n| David Wilson | 31 | Data Scientist | Australia |'
      }
    ]
  },
  {
    id: '7',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a video example?' }
    ]
  },
  {
    id: '8',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Sure! Here\'s a sample video:\n\n<video src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" controls poster="https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Video+Preview"></video>\n\nThis is a sample MP4 video with controls enabled.'
      }
    ]
  },
  {
    id: '7',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you format some code for me?' }
    ]
  },
  {
    id: '8',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Sure! Here\'s an example of JavaScript code:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\nAnd here\'s some Python code:\n\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))\n```'
      }
    ]
  },
  {
    id: '9',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a list of items?' }
    ]
  },
  {
    id: '10',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Certainly! Here\'s a list of frontend frameworks:\n\n1. React\n2. Vue.js\n3. Angular\n4. Svelte\n5. Ember.js\n\nAnd here are some benefits of using frontend frameworks:\n\n- Faster development\n- Code reusability\n- Better performance\n- Strong community support\n- Easier testing'
      }
    ]
  },
  {
    id: '11',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me an interactive option selection component?' }
    ]
  },
  {
    id: '12',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: "以下是一个可交互的选项列表组件：\n\n<div class=\"my-4\">\n  <OptionList \n    options=\"[{&quot;id&quot;:&quot;1&quot;,&quot;label&quot;:&quot;React 选项&quot;,&quot;description&quot;:&quot;使用React构建现代Web应用&quot;},{&quot;id&quot;:&quot;2&quot;,&quot;label&quot;:&quot;Vue 选项&quot;,&quot;description&quot;:&quot;使用Vue构建响应式用户界面&quot;},{&quot;id&quot;:&quot;3&quot;,&quot;label&quot;:&quot;Python 选项&quot;,&quot;description&quot;:&quot;使用Python进行后端开发&quot;}]\"\n    selectionMode=\"single\" \n    maxSelections=\"1\"\n    responseActions=\"[{&quot;label&quot;:&quot;确认选择&quot;,&quot;type&quot;:&quot;confirm&quot;}]\"\n  />\n</div>"
      }
    ]
  },
   {
    id: '13',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you play some audio?' }
    ]
  },
  {
    id: '14',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here\'s a sample audio clip:\n\n[Crowd Cheering Sample Audio](https://sample-videos.com/audio/mp3/crowd_cheering.mp3)'
      }
    ]
  },
  {
    id: '15',
    role: 'user',
    parts: [
      { type: 'text', content: 'Show me different types of content!' }
    ]
  },
  {
    id: '17',
    role: 'user',
    parts: [
      { type: 'text', content: 'Show me a video example!' }
    ]
  },
  {
    id: '18',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here is a video example with HTML video tag:\n\n<video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" width="640" height="360"></video>\n\nThis is a sample video from the Big Buck Bunny project.'
      }
    ]
  },
  {
    id: '19',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a plan or task list?' }
    ]
  },
  {
    id: '20',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here is a plan with tasks:\n\n<Plan \n  id="plan-comprehensive"\n  title="Feature Implementation Plan"\n  description="Step-by-step guide for implementing the new authentication system"\n  todos={[{"id":"1","label":"Review existing auth flow","status":"completed","description":"Analyzed current session-based auth and identified pain points"},{"id":"2","label":"Design new token structure","status":"completed","description":"Created JWT schema with access/refresh token separation"},{"id":"3","label":"Implement JWT middleware","status":"in_progress","description":"Adding token validation and refresh logic to API routes"},{"id":"4","label":"Add refresh token logic","status":"pending"},{"id":"5","label":"Update user model","status":"pending"},{"id":"6","label":"Write integration tests","status":"pending","description":"Cover auth flows, token expiry, and edge cases"},{"id":"7","label":"Update API documentation","status":"pending"},{"id":"8","label":"Deploy to staging","status":"pending"}]}\n/>'
      }
    ]
  }
];
