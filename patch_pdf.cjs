const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/CourseDetails.tsx', 'utf8');

const oldPdfMock = `                ) : activeItem.type === 1 ? (
                  <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-10 text-center space-y-4 border-b border-border">
                    <FileText className="w-12 h-12 text-primary" />
                    <div>
                      <h3 className="font-bold text-xl text-foreground">{activeItem.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Course Reference Notes & Blueprint PDF</p>
                    </div>
                    {activeItem.contentUrl ? (
                      <a href={activeItem.contentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-sm">
                        <ExternalLink className="w-4 h-4" /> Open Document Viewer
                      </a>
                    ) : (
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-sm">
                        <ExternalLink className="w-4 h-4" /> Open Document Viewer
                      </button>
                    )}
                  </div>
                ) : activeItem.type === 2 ? (`;

const newPdfMock = `                ) : activeItem.type === 1 || activeItem.type === 'document' ? (
                  activeItem.contentUrl ? (
                    <iframe 
                      src={activeItem.contentUrl} 
                      className="w-full h-full border-none bg-white"
                      title={activeItem.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-10 text-center space-y-4 border-b border-border">
                      <FileText className="w-12 h-12 text-primary" />
                      <div>
                        <h3 className="font-bold text-xl text-foreground">{activeItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Document placeholder</p>
                      </div>
                    </div>
                  )
                ) : activeItem.type === 2 || activeItem.type === 'quiz' ? (`;

content = content.replace(oldPdfMock, newPdfMock);
fs.writeFileSync('src/features/student/pages/CourseDetails.tsx', content);
