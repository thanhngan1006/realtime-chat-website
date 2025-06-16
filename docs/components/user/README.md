# User Components

## UserItem

A component that displays individual user information in the user list.

### Props

| Prop            | Type   | Default  | Description                 |
| --------------- | ------ | -------- | --------------------------- |
| name            | string | required | User's name                 |
| imgUrl          | string | required | User's avatar image URL     |
| timeSendMessage | string | required | Time of the last message    |
| messageContent  | string | required | Content of the last message |

### Usage

```jsx
<UserItem
  name="John Doe"
  imgUrl="https://example.com/avatar.jpg"
  timeSendMessage="2 hours ago"
  messageContent="Hello, how are you?"
/>
```

## UserList

A container component that displays a list of users.

### Props

| Prop  | Type  | Default  | Description           |
| ----- | ----- | -------- | --------------------- |
| users | array | required | Array of user objects |

### Usage

```jsx
<UserList
  users={[
    {
      name: 'John Doe',
      imgUrl: 'https://example.com/avatar1.jpg',
      timeSendMessage: '2 hours ago',
      messageContent: 'Hello!',
    },
    // ... more users
  ]}
/>
```

## UserStory

A component that displays user stories in a horizontal scrollable list.

### Props

| Prop       | Type  | Default  | Description            |
| ---------- | ----- | -------- | ---------------------- |
| userStorys | array | required | Array of story objects |

### Usage

```jsx
<UserStory
  userStorys={[
    {
      name: 'John',
      src: 'https://example.com/story1.jpg',
    },
    // ... more stories
  ]}
/>
```

## UserStoryItem

A component that displays an individual user story.

### Props

| Prop | Type   | Default  | Description     |
| ---- | ------ | -------- | --------------- |
| src  | string | required | Story image URL |
| name | string | required | User's name     |

### Usage

```jsx
<UserStoryItem src="https://example.com/story.jpg" name="John" />
```

## SearchPeople

A component for searching and filtering users.

### Props

| Prop      | Type   | Default | Description            |
| --------- | ------ | ------- | ---------------------- |
| className | string | ''      | Additional CSS classes |

### Usage

```jsx
<SearchPeople className="search-container" />
```

## Best Practices

1. Always provide fallback images for user avatars
2. Implement proper loading states for user data
3. Handle empty states for user lists
4. Implement proper error handling for failed image loads
5. Use proper alt text for accessibility
6. Implement proper keyboard navigation for user lists
