const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/CourseDetails.tsx', 'utf8');

const oldVideoMock = `                  <div className="text-center p-8 text-white space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{activeItem.title}</h4>
                      {activeItem.contentUrl ? (
                        <div className="mt-4">
                           <a href={activeItem.contentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition shadow-sm">
                             <PlayCircle className="w-4 h-4" /> Watch Video
                           </a>
                        </div>
                      ) : (
                        <p className="text-sm text-white/70 mt-1">Live lecture video stream connected.</p>
                      )}
                    </div>
                  </div>`;

const newVideoMock = `                  activeItem.contentUrl ? (
                    <video 
                      src={activeItem.contentUrl} 
                      controls 
                      className="w-full h-full object-cover"
                      poster={course.thumbnailUrl || undefined}
                    >
                      <source src={activeItem.contentUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center p-8 text-white space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{activeItem.title}</h4>
                        <p className="text-sm text-white/70 mt-1">Video stream placeholder</p>
                      </div>
                    </div>
                  )`;

content = content.replace(oldVideoMock, newVideoMock);
fs.writeFileSync('src/features/student/pages/CourseDetails.tsx', content);
