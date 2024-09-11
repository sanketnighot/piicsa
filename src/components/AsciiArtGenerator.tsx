import React, { useState, useCallback } from 'react';
import { Upload, UploadCloud, Copy, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];

const AsciiArtGenerator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [scaleFactor, setScaleFactor] = useState<number>(0.1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setAsciiArt('');
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAsciiArt = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to create canvas context');

      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let asciiImage = '';
      for (let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        const charIndex = Math.floor(avg / 25);
        asciiImage += ASCII_CHARS[charIndex];
        if ((i / 4 + 1) % canvas.width === 0) asciiImage += '\n';
      }

      setAsciiArt(asciiImage);
    } catch (err) {
      console.error('Error generating ASCII art:', err);
      setError('Error generating ASCII art. Please try again.');
    }
  }, [selectedFile, scaleFactor]);

  const copyAsciiArt = () => {
    navigator.clipboard.writeText(asciiArt).then(() => {
      alert('ASCII art copied to clipboard!');
    });
  };

  const clearAll = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAsciiArt('');
    setError('');
  };

  return (
    <Card className="w-4/6 max-w-4/6 mx-auto bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">ASCII Art Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                handleFileChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-primary/50 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
              <div className="text-center">
                <UploadCloud className="mx-auto h-16 w-16 text-primary/70" />
                <p className="mt-2 text-sm text-primary/70">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>
          </label>
        </div>

        {selectedFile && (
          <p className="mb-4 text-center text-muted-foreground">Selected file: {selectedFile.name}</p>
        )}

        <div className="mb-4">
          <label htmlFor="scale-factor" className="block text-sm font-medium text-primary mb-1">
            ASCII Art Size (smaller value = smaller art):
          </label>
          <input
            type="range"
            id="scale-factor"
            min="0.01"
            max="0.2"
            step="0.01"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-muted-foreground">{scaleFactor.toFixed(2)}</span>
        </div>

        <div className="flex justify-center mb-6 space-x-4">
          <Button onClick={generateAsciiArt} className="w-auto">
            <Upload className="mr-2 h-5 w-5" /> Generate ASCII Art
          </Button>
          {(selectedFile || asciiArt) && (
            <Button onClick={clearAll} variant="outline" className="w-auto">
              <Trash2 className="mr-2 h-5 w-5" /> Clear All
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {imagePreview && (
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3 text-primary">Uploaded Image:</h2>
              <img src={imagePreview} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
            </div>
          )}

          {asciiArt && (
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-primary">Generated ASCII Art:</h2>
                <Button onClick={copyAsciiArt} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {asciiArt}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AsciiArtGenerator;