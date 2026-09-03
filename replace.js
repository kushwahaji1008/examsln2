const fs = require('fs');
let text = fs.readFileSync('src/features/teacher/pages/TeacherExamNew.tsx', 'utf8');
const search = '<div className="space-y-2">\n          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link to Course ID</label>\n          <input \n             type="text" \n             value={courseId} \n             onChange={e => setCourseId(e.target.value)}\n            placeholder="Enter Course ID"\n            required\n            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"\n          />\n        </div>';

const replace = `<div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course *</label>
          <select 
             value={courseId} 
             onChange={e => setCourseId(e.target.value)}
             disabled={fetchingCourses || courses.length === 0}
             className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
          >
            {fetchingCourses ? (
              <option value="">Loading courses...</option>
            ) : courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map(course => (
                <option key={course.courseId || course.id} value={course.courseId || course.id}>
                  {course.title}
                </option>
              ))
            )}
          </select>
          {courses.length === 0 && !fetchingCourses && (
             <p className="text-xs text-destructive mt-1">You must create a course before creating an exam.</p>
          )}
        </div>`;

text = text.replace(search, replace);
fs.writeFileSync('src/features/teacher/pages/TeacherExamNew.tsx', text);
