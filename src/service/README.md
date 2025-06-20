# Service Layer Architecture

This directory contains all data access logic, separating it from UI components and business logic.

## Structure

```
service/
├── firebase/           # Firebase-specific services
│   ├── auth.service.js
│   └── user.service.js
├── api/               # External API services
│   └── config.js
├── repository/        # Repository pattern implementations
│   ├── base.repository.js
│   └── user.repository.js
└── utils/             # Service utilities
    ├── error-handler.js
    └── response-formatter.js
```

## Patterns

### Service Pattern

Services encapsulate business logic and data access:

```javascript
class UserService {
  async getUser(userId) {
    // Implementation
  }
}
```

### Repository Pattern

Repositories provide an abstraction over data sources:

```javascript
class UserRepository {
  async findById(id) {
    // Can switch between Firestore, API, etc.
  }
}
```

## Usage

```javascript
import { userService } from '@/service/firebase/user.service';

const user = await userService.getUser(userId);
```
