# Common Components

## Avatar

A reusable component for displaying user avatars.

### Props

| Prop      | Type    | Default  | Description                |
| --------- | ------- | -------- | -------------------------- |
| src       | string  | required | Image source URL           |
| className | string  | ''       | Additional CSS classes     |
| isOnline  | boolean | false    | Whether the user is online |

### Usage

```jsx
<Avatar
  src="https://example.com/avatar.jpg"
  className="h-10 w-10"
  isOnline={true}
/>
```

## Button

A reusable button component with various styles.

### Props

| Prop      | Type     | Default  | Description            |
| --------- | -------- | -------- | ---------------------- |
| children  | node     | required | Button content         |
| className | string   | ''       | Additional CSS classes |
| onClick   | function | () => {} | Click handler function |

### Usage

```jsx
<Button
  className="bg-blue-500 px-4 py-2"
  onClick={() => console.log('clicked')}
>
  Click Me
</Button>
```

## Input

A reusable input component with various styles.

### Props

| Prop        | Type     | Default  | Description             |
| ----------- | -------- | -------- | ----------------------- |
| type        | string   | 'text'   | Input type              |
| placeholder | string   | ''       | Placeholder text        |
| className   | string   | ''       | Additional CSS classes  |
| value       | string   | ''       | Input value             |
| onChange    | function | () => {} | Change handler function |

### Usage

```jsx
<Input
  type="text"
  placeholder="Enter your message"
  className="w-full rounded-lg"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

## Loader

A simple loading spinner component.

### Props

| Prop      | Type   | Default | Description            |
| --------- | ------ | ------- | ---------------------- |
| className | string | ''      | Additional CSS classes |

### Usage

```jsx
<Loader className="spinner" />
```

## PrivateRoute

A route component that handles authentication and protected routes.

### Props

| Prop     | Type | Default  | Description                |
| -------- | ---- | -------- | -------------------------- |
| children | node | required | Child components to render |

### Usage

```jsx
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

## SubMenuItem

A menu item component for the submenu.

### Props

| Prop      | Type     | Default  | Description                 |
| --------- | -------- | -------- | --------------------------- |
| children  | node     | required | Menu item content           |
| leftIcon  | node     | null     | Icon to display on the left |
| className | string   | ''       | Additional CSS classes      |
| onClick   | function | () => {} | Click handler function      |

### Usage

```jsx
<SubMenuItem
  leftIcon={<SettingsIcon />}
  className="menu-item"
  onClick={() => console.log('clicked')}
>
  Settings
</SubMenuItem>
```

## Best Practices

1. Use consistent styling across all common components
2. Implement proper accessibility attributes
3. Handle loading and error states appropriately
4. Use proper TypeScript types or PropTypes
5. Implement proper keyboard navigation
6. Follow React best practices for event handling
7. Use proper semantic HTML elements
8. Implement proper focus management
