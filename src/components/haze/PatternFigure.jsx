import { DayAxis, DayRow, Legend, ProfileCard } from './DayParts';
import { DAY_ROWS } from './hazeData';

// One person's day. Points of activity sit in rows by what they are about,
// and along the day by when they happen. Under them is the profile that can
// be read off the pattern. The markup is the finished frame: every point in
// its place and the profile sharp. The motion starts with the points
// scattered and soft, and gathers them.
export default function PatternFigure() {
  return (
    <svg className="hz-fig hz-fig--pattern" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <Legend />
      {DAY_ROWS.real.map((row) => (
        <DayRow key={row.id} row={row} kind="real" />
      ))}
      <DayAxis />
      <ProfileCard />
    </svg>
  );
}
