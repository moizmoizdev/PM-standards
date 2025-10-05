# PM Standards Analyzer 🎯

A comprehensive web application for analyzing and comparing project management standards including PMBOK Guide 7th Edition, ISO 21502:2020, and ISO 21500:2021. Features intelligent AI-powered semantic search, cross-standard comparisons, and deep-linking navigation.

![PM Standards Analyzer](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)
![AI Powered](https://img.shields.io/badge/AI-Semantic%20Search-purple?style=flat-square&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features:

### 🔍 **Intelligent Search**
- **Regular Search**: Lightning-fast keyword-based search across all standards
- **AI Semantic Search**: Advanced semantic understanding using transformer models
- **Hybrid Search**: Combines AI intelligence with keyword precision
- **Deep Linking**: Direct navigation to specific topics and subtopics

### 📊 **Comprehensive Comparisons**
- **Standards Comparison**: Side-by-side analysis of PM standards approaches
- **Interactive Heatmap**: Visual comparison matrix with topic coverage analysis
- **Cross-Book Comparison**: Compare any two book topics/subtopics in detail
- **Go to Reference**: Seamless navigation from comparisons to full content

### 📚 **Complete Content Access**
- **Structured Reading**: Hierarchical navigation through books and topics
- **Multi-Level Content**: Support for topics, subtopics, and sub-subtopics
- **Content Filtering**: Smart filtering of incomplete or unlabeled content
- **URL Parameters**: Shareable deep links to specific content sections

### 🧠 **AI-Powered Insights**
- **Semantic Understanding**: Find related concepts even without exact word matches
- **Context-Aware Results**: Understands meaning behind queries
- **Resource Optimization**: Configurable performance vs. speed trade-offs
- **Fallback Strategy**: Graceful degradation to keyword search

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pm-standards-analyzer.git
cd pm-standards-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 📖 Available Standards

| Standard | Description | Coverage |
|----------|-------------|----------|
| **PMBOK Guide 7th Edition** | A Guide to the Project Management Body of Knowledge | 257 records |
| **ISO 21502:2020** | Project, programme and portfolio management — Guidance on project management | 695 records |
| **ISO 21500:2021** | Project, programme and portfolio management — Context and concepts | 130 records |

## 🎯 Usage Examples

### Basic Search
```
Search: "risk management"
→ Finds exact mentions of risk management across all standards
```

### Semantic Search (AI)
```
Search: "team leadership"
→ Finds related concepts: "managing people", "human resources", "team dynamics"

Search: "project uncertainty" 
→ Finds: "risk management", "threat analysis", "uncertainty handling"
```

### Deep Linking
```
URL: /read-book?book=pmbok&topic=Risk%20Management&subtopic=Risk%20Response
→ Opens PMBOK directly to Risk Response subtopic
```

## 🏗️ Architecture

### Frontend
- **React 18**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first styling with custom theme
- **React Router**: Client-side routing with deep linking
- **Lucide React**: Consistent iconography

### AI/ML
- **Transformers.js**: Browser-based machine learning
- **all-MiniLM-L6-v2**: Lightweight semantic embedding model
- **Cosine Similarity**: Vector similarity calculations
- **Lazy Loading**: On-demand model initialization

### Data Structure
```json
{
  "sections": {
    "section_key": {
      "name": "Section Name",
      "records": [
        {
          "topic": "Main Topic",
          "subtopic": "Subtopic",
          "subsubtopic": "Sub-subtopic",
          "content": "Detailed content..."
        }
      ]
    }
  }
}
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (Button, Card, etc.)
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Main navigation hub
│   ├── Search.jsx      # Search functionality
│   ├── Comparison.jsx  # Standards comparison
│   └── ReadBook.jsx    # Content reading interface
├── utils/              # Utility functions
│   └── semanticSearch.js # AI search engine
└── data/               # Static data and configurations
```

### Key Components

#### Search Engine (`src/utils/semanticSearch.js`)
- Lazy-loaded transformer model
- Embedding caching for performance
- Resource-configurable processing
- Hybrid search combining semantic + keyword

#### Comparison Engine (`src/pages/Comparison.jsx`)
- Standards comparison matrix
- Interactive heatmap visualization
- Cross-book topic comparison
- Deep linking integration

#### Content Reader (`src/pages/ReadBook.jsx`)
- Hierarchical content navigation
- URL parameter parsing
- Progressive disclosure UI
- Content filtering and validation

### Configuration

#### AI Search Performance
```javascript
// Resource-intensive (better quality)
maxConcurrentEmbeddings: 5
batchDelay: 50ms
precision: 'fp32'
cacheSize: 500

// Resource-friendly (faster)
maxConcurrentEmbeddings: 3
batchDelay: 100ms  
precision: 'fp16'
cacheSize: 200
```

## 🎨 Customization

### Theme Colors
The application uses a light, skin-toned color palette defined in `src/index.css`:

```css
:root {
  --background: 45 7% 97%;
  --foreground: 20 6% 10%;
  --primary: 24 10% 60%;
  --accent: 30 15% 92%;
}
```

### Adding New Standards
1. Prepare data in the required JSON format
2. Add book configuration in relevant components
3. Place JSON file in `public/flattened_books/`
4. Update book count in dashboard statistics

## 🚦 Performance

### Search Performance
- **Regular Search**: <100ms (instant)
- **AI Semantic Search**: 30-120 seconds (configurable)
- **Hybrid Search**: 45-150 seconds (best quality)

### Optimization Features
- Embedding caching reduces repeat processing
- Progressive loading prevents browser freezing
- Configurable resource usage
- Graceful fallback to keyword search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add proper error handling
- Include user feedback for long operations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Transformers.js** - Browser-based machine learning
- **Hugging Face** - Pre-trained language models
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **React Team** - Modern web development framework

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/pm-standards-analyzer/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/pm-standards-analyzer/discussions)
- 📧 **Contact**: your.email@example.com

---

<div align="center">

**[🌐 Live Demo](https://your-demo-url.com)** | **[📚 Documentation](https://github.com/yourusername/pm-standards-analyzer/wiki)** | **[🎯 Roadmap](https://github.com/yourusername/pm-standards-analyzer/projects)**

Made with ❤️ for the Project Management community

</div>
