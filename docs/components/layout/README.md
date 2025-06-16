# Layout Components

## Sidebar

The main navigation sidebar component that displays user list and search functionality.

### Props

| Prop      | Type   | Default | Description            |
| --------- | ------ | ------- | ---------------------- |
| className | string | ''      | Additional CSS classes |

### Usage

```jsx
<Sidebar className="main-sidebar" />
```

## HeadingMessageBar

The header component for the chat area that displays user information and action buttons.

### Props

| Prop       | Type   | Default  | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| name       | string | required | Name of the chat participant        |
| activeTime | string | required | Last active time of the participant |

### Usage

```jsx
<HeadingMessageBar name="John Doe" activeTime="2 hours ago" />
```

## SubMenu

A dropdown menu component that appears when clicking the user avatar.

### Props

| Prop      | Type   | Default | Description                            |
| --------- | ------ | ------- | -------------------------------------- |
| className | string | ''      | Additional CSS classes for positioning |

### Usage

```jsx
<SubMenu className="top-14 left-0" />
```

## Best Practices

1. Use consistent spacing and padding in layout components
2. Ensure responsive design for all screen sizes
3. Maintain proper z-index hierarchy for overlapping elements
4. Use semantic HTML elements for better accessibility
5. Implement proper keyboard navigation for interactive elements
