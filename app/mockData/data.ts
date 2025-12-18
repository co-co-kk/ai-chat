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
        content: 'Absolutely! Here\'s an interactive option list where you can select multiple options:\n\n<div class="option-list-container">
  <OptionList
    options={[
      {
        "id": "good",
        "label": "Good",

        "description": "High quality work"
      },
      {
        "id": "fast",
        "label": "Fast",
        "description": "Quick turnaround"
      },
      {
        "id": "cheap",
        "label": "Cheap",
        "description": "Low cost"
      }
    ]}
    selectionMode="multi"
    maxSelections={2}
    responseActions={[
      {
        "id": "cancel",
        "label": "Reset",
        "variant": "ghost"
      },
      {
        "id": "confirm",
        "label": "Confirm",
        "variant": "default"
      }
    ]}
    onConfirm={(selection) => console.log("Selected options:", selection)}
  />
</div>\n\nThis is a custom OptionList component built with React and Tailwind CSS. You can select up to 2 options from the three available choices, then confirm or reset your selection.'
      }
    ]
  },
  {
    id: '11',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a video?' }
    ]
  },
  {
    id: '12',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here\'s a sample video for you:\n\n[Big Buck Bunny Sample Video](https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4)'
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
    id: '16',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here are various content types that can be displayed:\n\n## Image Gallery\n\n![Mountain View](https://picsum.photos/seed/mountain_view/400/300)\n![Ocean View](https://picsum.photos/seed/ocean_view/400/300)\n![Forest View](https://picsum.photos/seed/forest_scene/400/300)\n\n## Code Snippet\n\n```python\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nx = np.linspace(0, 2*np.pi, 100)\ny = np.sin(x)\n\nplt.plot(x, y)\nplt.title("Sine Wave")\nplt.show()\n```\n\n## Data Table\n\n| Product | Price | Stock |\n|---------|-------|-------|\n| Laptop  | $999  | 25    |\n| Mouse   | $29   | 150   |\n| Keyboard| $79   | 80    |\n\n## Checklist\n\n- [x] Create project structure\n- [x] Implement basic UI\n- [ ] Add authentication\n- [ ] Deploy to production\n\n## Blockquote\n\n> "The only way to do great work is to love what you do." \n> \n> - Steve Jobs'
      }
    ]
  },
  {
    id: '17',
    role: 'user',
    parts: [
      { type: 'text', content: 'What other multimedia can you show?' }
    ]
  },
  {
    id: '18',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'We can also display different types of charts and diagrams. Here\'s an example of how a bar chart might be represented:\n\n![Bar Chart](https://picsum.photos/seed/bar_chart_sample/500/300)\n\nWe can also embed external content like maps:\n\n![Map](https://picsum.photos/seed/world_map_view/500/300)\n\nAnd even scientific illustrations:\n\n![Scientific Illustration](https://picsum.photos/seed/scientific_drawing/500/300)'
      }
    ]
  },
  {
    id: '19',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you let me choose an output format?' }
    ]
  },
  {
    id: '20',
    role: 'assistant',
    parts: [
      {
        type: 'tool-call',
        toolCall: {
          toolName: 'selectFormat',
          args: {
            id: 'format-choice-1',
            title: 'Choose your preferred output format',
            options: [
              { value: 'json', label: 'JSON', description: 'Structured data format' },
              { value: 'markdown', label: 'Markdown', description: 'Rich text with formatting' },
              { value: 'plain', label: 'Plain Text', description: 'Simple unformatted text' },
              { value: 'html', label: 'HTML', description: 'Web-ready markup' }
            ]
          }
        }
      }
    ]
  },
  {
    id: '21',
    role: 'user',
    parts: [
      { type: 'text', content: 'Show me a working data table with actions' }
    ]
  },
  {
    id: '22',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here\'s an interactive data table with sample issues and actions:\n\n```json\n{\n  "rowIdKey": "id",\n  "columns": [\n    { "key": "issue", "label": "Issue", "priority": "primary", "truncate": true },\n    {\n      "key": "priority",\n      "label": "Urgency",\n      "format": {\n        "kind": "status",\n        "statusMap": {\n          "high": { "tone": "danger", "label": "High" },\n          "medium": { "tone": "warning", "label": "Medium" },\n          "low": { "tone": "neutral", "label": "Low" }\n        }\n      }\n    },\n    { "key": "createdAt", "label": "Created", "format": { "kind": "date", "dateFormat": "relative" } },\n    { "key": "amount", "label": "Amount", "align": "right", "format": { "kind": "currency", "currency": "USD", "decimals": 2 } }\n  ],\n  "data": [\n    {\n      "id": "1",\n      "issue": "Webhook retries inconsistent",\n      "priority": "high",\n      "createdAt": "2025-11-14T10:30:00Z",\n      "amount": 527.50\n    },\n    {\n      "id": "2",\n      "issue": "Payment failing on checkout",\n      "priority": "high",\n      "createdAt": "2025-11-11T09:24:00Z",\n      "amount": 129.99\n    },\n    {\n      "id": "3",\n      "issue": "Billing UI alignment bug",\n      "priority": "medium",\n      "createdAt": "2025-11-11T17:03:00Z",\n      "amount": 42.00\n    }\n  ],\n  "defaultSort": { "by": "createdAt", "direction": "desc" }\n}\n```'
      }
    ]
  },
  {
    id: '23',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a properly embedded video?' }
    ]
  },
  {
    id: '24',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here\'s a properly embedded video that should render correctly:\n\n<video width="640" height="360" controls>\n  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n\nAnd here\'s a YouTube embed:\n\n<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
      }
    ]
  },
  {
    id: '25',
    role: 'user',
    parts: [
      { type: 'text', content: 'Show me different button styles and forms' }
    ]
  },
  {
    id: '26',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here are various UI components you can use:\n\n### Primary Buttons\n<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n  Primary Action\n</button>\n\n### Secondary Buttons\n<button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">\n  Secondary\n</button>\n\n### Form Elements\n<form class="space-y-4">\n  <div>\n    <label class="block text-sm font-medium text-gray-700">Email</label>\n    <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="you@example.com">\n  </div>\n  <div>\n    <label class="block text-sm font-medium text-gray-700">Priority</label>\n    <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">\n      <option>Low</option>\n      <option>Medium</option>\n      <option>High</option>\n    </select>\n  </div>\n</form>\n\n### Toggle Switch\n<label class="relative inline-flex items-center cursor-pointer">\n  <input type="checkbox" class="sr-only peer">\n  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>\n  <span class="ml-3 text-sm font-medium text-gray-900">Enable notifications</span>\n</label>'
      }
    ]
  },
  {
    id: '27',
    role: 'user',
    parts: [
      { type: 'text', content: 'Can you show me a progress indicator?' }
    ]
  },
  {
    id: '28',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        content: 'Here are different progress indicators:\n\n### Linear Progress\n<div class="w-full bg-gray-200 rounded-full h-2.5">\n  <div class="bg-blue-600 h-2.5 rounded-full" style="width: 45%"></div>\n</div>\n\n### Circular Progress\n<div class="flex items-center justify-center">\n  <svg class="w-16 h-16">\n    <circle class="text-gray-200" stroke-width="2" stroke="currentColor" fill="transparent" r="30" cx="32" cy="32"/>\n    <circle class="text-blue-600" stroke-width="2" stroke-dasharray="188.4" stroke-dashoffset="103.6" stroke-linecap="round" stroke="currentColor" fill="transparent" r="30" cx="32" cy="32"/>\n  </svg>\n  <span class="ml-2 text-sm font-medium">75%</span>\n</div>\n\n### Step Progress\n<ol class="flex items-center w-full">\n  <li class="flex w-full items-center text-blue-600 after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-1 after:inline-block">\n    <span class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 shrink-0">1</span>\n  </li>\n  <li class="flex w-full items-center after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-1 after:inline-block">\n    <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 shrink-0">2</span>\n  </li>\n  <li class="flex items-center">\n    <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 shrink-0">3</span>\n  </li>\n</ol>'
      }
    ]
  }
];
