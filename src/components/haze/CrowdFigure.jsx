import { DayAxis, DayRow, Legend, ProfileCard, SoftDefs } from './DayParts';
import { DAY_ROWS } from './hazeData';

// The same day with decoys running beside it. Each decoy has a row of its
// own, with its own interest and its own hours, and some decoy activity
// lands on the real rows too. The profile under it is drawn soft: with every
// rhythm laid over the others, no single one stands out. The motion starts
// from the sharp profile of the scene before and brings the decoys in.
export default function CrowdFigure() {
  const extra = (id) => DAY_ROWS.mixed.find((row) => row.id === id);
  return (
    <svg className="hz-fig hz-fig--crowd" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <SoftDefs />
      <Legend decoys />
      {DAY_ROWS.decoys.map((row) => (
        <DayRow key={row.id} row={row} kind="decoy" />
      ))}
      {DAY_ROWS.real.map((row) => (
        <DayRow key={row.id} row={row} kind="real" extra={extra(row.id)} />
      ))}
      <DayAxis />
      <ProfileCard mixed />
    </svg>
  );
}
