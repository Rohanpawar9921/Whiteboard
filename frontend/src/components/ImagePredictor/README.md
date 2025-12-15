## ImagePredictor Component

### Location
`/frontend/src/components/ImagePredictor/ImagePredictor.tsx`

### Features Implemented

✅ **File Upload Input**
- Bootstrap-styled file input with browse button
- Accepts JPEG, PNG, WebP formats
- 10MB file size limit
- Client-side validation

✅ **Image Preview**
- Automatic preview generation using FileReader
- Responsive image display
- Clean, centered layout with Bootstrap

✅ **Backend Integration**
- Uploads to `/api/upload` endpoint
- Sends image URL to `/api/predict` endpoint
- Proper error handling
- Loading states for upload and prediction

✅ **Prediction Display**
- Top prediction highlighted in success card
- All predictions shown in list with:
  - Ranked order (1, 2, 3)
  - Label names
  - Confidence scores
  - Visual progress bars
  - Color-coded (green for top, blue for second, gray for rest)

### Usage Example

```tsx
import ImagePredictor from '@/components/ImagePredictor';

const MyPage = () => {
  return (
    <div>
      <ImagePredictor />
    </div>
  );
};
```

### Props
None - standalone component with internal state management

### Files Created
- `ImagePredictor.tsx` - Main component
- `ImagePredictor.module.css` - Scoped styles
- `index.ts` - Barrel export

### API Integration
Uses existing `apiService` methods:
- `uploadImage(file: File)` - Uploads image file
- `predictImage(imageUrl: string)` - Gets predictions

### Styling
- Bootstrap 5 classes throughout
- Custom CSS module for specific sizing
- Responsive design
- Professional UX matching Microsoft Whiteboard aesthetic
