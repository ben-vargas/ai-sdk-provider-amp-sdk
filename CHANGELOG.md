# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Removed strict AMP_API_KEY requirement - now supports both `amp login` and environment variable authentication
- Updated error messages to guide users on both authentication methods
- Enhanced authentication error handling to catch more error types from CLI

### Added
- Initial implementation of Amp SDK provider for Vercel AI SDK v5
- Support for text generation (streaming and non-streaming)
- Support for object generation with Zod schemas
- Session management and conversation continuity
- Custom configuration options
- MCP server configuration support
- Permission management
- Error handling utilities
- Comprehensive examples
- Full TypeScript support
- Flexible authentication: AMP_API_KEY env var OR `amp login` credentials
- Detailed authentication guide (AUTHENTICATION.md)

## [0.1.0] - 2025-01-XX

### Added
- Initial release of ai-sdk-provider-amp-sdk
- Integration with @sourcegraph/amp-sdk
- Support for Vercel AI SDK v5
- Basic text generation
- Streaming support
- Object generation
- Configuration options
- Examples and documentation
