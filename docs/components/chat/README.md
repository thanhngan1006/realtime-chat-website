# Chat Components

## Message

A single message component that displays individual chat messages.

### Props

| Prop          | Type    | Default    | Description                                  |
| ------------- | ------- | ---------- | -------------------------------------------- |
| children      | node    | required   | The message content                          |
| bgColor       | string  | 'blue-500' | Background color for the message bubble      |
| textColor     | string  | 'white'    | Text color for the message                   |
| className     | string  | ''         | Additional CSS classes                       |
| src           | string  | ''         | Avatar image source URL                      |
| isYourMessage | boolean | false      | Whether the message is from the current user |
| isShowAvatar  | boolean | false      | Whether to show the sender's avatar          |

### Usage

```jsx
<Message
  isYourMessage={true}
  bgColor="blue-500"
  textColor="white"
  src="https://example.com/avatar.jpg"
  isShowAvatar={true}
>
  Hello, how are you?
</Message>
```

## MessageBox

A container component that groups multiple messages together.

### Props

| Prop          | Type    | Default  | Description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| messages      | array   | required | Array of message strings                       |
| isYourMessage | boolean | false    | Whether the messages are from the current user |
| src           | string  | ''       | Avatar image source URL for the sender         |

### Usage

```jsx
<MessageBox
  messages={['Hello!', 'How are you?', 'Nice to meet you!']}
  isYourMessage={false}
  src="https://example.com/avatar.jpg"
/>
```

## OptionsForMessage

A component that displays options for message interaction (e.g., reply, forward, delete).

### Props

| Prop      | Type   | Default | Description            |
| --------- | ------ | ------- | ---------------------- |
| className | string | ''      | Additional CSS classes |

### Usage

```jsx
<OptionsForMessage className="message-options" />
```

## Best Practices

1. Always provide a unique key when rendering multiple messages
2. Use appropriate background colors to distinguish between sent and received messages
3. Include avatar images for better user identification
4. Handle message options appropriately based on user permissions
