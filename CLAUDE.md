# Claude Code Configuration

## n8n-mcp Integration

### Server Configuration
```yaml
Server: Railway Production
URL: https://primary-production-83560.up.railway.app/
API_KEY: Configured
Status: Connected
```

### Available Tools
- **Nodes**: 535 total (437 base + 98 langchain)
- **AI Tools**: 269 nodes
- **Triggers**: 108 nodes
- **Templates**: 2,598 workflows

### Quick Commands
```javascript
// Connection & Health
n8n_health_check()
n8n_diagnostic({verbose: true})
n8n_list_available_tools()

// Workflow Management
n8n_list_workflows()
n8n_get_workflow({id: "workflow_id"})
n8n_create_workflow({name: "New Workflow", nodes: [], connections: {}})

// Node Discovery
search_nodes({query: "webhook"})
list_nodes({limit: 200})
list_ai_tools()
get_node_info({nodeType: "nodes-base.webhook"})

// Templates
search_templates({query: "automation"})
get_templates_for_task({task: "data_sync"})
```

## Vault Structure

### 3-Layer Ontology
```
0_INBOX/              # 수집 및 임시 저장
1_SEMANTIC_LAYER/     # 지식 및 개념 (Knowledge)
2_KINETIC_LAYER/      # 실행 및 행동 (Action)
3_DYNAMIC_LAYER/      # 피드백 및 결과 (Feedback)
```

### n8n Workflows Location
```
2_KINETIC_LAYER/
└── Automation/
    └── n8n-workflows/
        ├── templates/      # 재사용 가능한 템플릿
        ├── active/        # 활성화된 워크플로우
        ├── archive/       # 보관된 워크플로우
        └── documentation/ # 가이드 및 문서
```

## Workflow Patterns

### Daily Note Automation
- Trigger: Schedule (6 AM daily)
- Actions: Generate → Apply Template → Save to Obsidian

### Investment Data Sync
- Trigger: Webhook/Schedule
- Actions: API Call → Transform → Update Notes → Send Alert

### AI Content Generation
- Trigger: Manual/Webhook
- Actions: AI API → Generate → Format → Save

## Common Node Types

### Essential Nodes
- `HTTP Request`: API calls
- `Webhook`: External events
- `Code`: Custom logic
- `Schedule Trigger`: Timed execution
- `Set`: Data transformation
- `IF`: Conditional branching

### AI/LangChain Nodes
- `OpenAI`: ChatGPT integration
- `AI Agent`: Intelligent agents
- `Text Classifier`: Classification
- `Embeddings`: Vector generation

## Best Practices

1. **Error Handling**: Always enable `continueOnFail` for critical nodes
2. **Performance**: Use Code nodes for complex logic
3. **Security**: Never expose API keys in workflows
4. **Testing**: Test in development before production
5. **Documentation**: Document all custom code nodes

## Troubleshooting

### Connection Issues
```javascript
// Check connection status
n8n_diagnostic({verbose: true})

// Verify API configuration
n8n_health_check()
```

### Common Errors
- `NO_RESPONSE`: Check if n8n server is running
- `AUTH_ERROR`: Verify API key is correct
- `RATE_LIMIT`: Implement throttling

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)
- [n8n Templates](https://n8n.io/workflows)
- [[2_KINETIC_LAYER/Automation/n8n-workflows/README]]
- [[2_KINETIC_LAYER/Automation/n8n-workflows/documentation/n8n_mcp_usage_guide]]