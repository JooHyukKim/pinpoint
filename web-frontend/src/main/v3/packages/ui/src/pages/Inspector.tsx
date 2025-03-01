import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspectorSearchParameters } from '@pinpoint-fe/hooks';
import { useTranslation } from 'react-i18next';
import {
  DatetimePicker,
  DatetimePickerChangeHandler,
  LayoutWithContentSidebar,
  MainHeader,
  InspectorSidebar,
  InspectorApplicationChartList,
  InspectorAgentChartList,
  InspectorAgentInfo,
  InspectorAgentStatusTimeline,
  InspectorApplicationStatusTimeline,
  ApplicationCombinedList,
} from '../components';
import { convertParamsToQueryString, getInspectorPath } from '@pinpoint-fe/utils';
import { FaChartLine } from 'react-icons/fa';

export const InspectorPage = () => {
  const navigate = useNavigate();
  const { searchParameters, application, agentId, version } = useInspectorSearchParameters();
  const { t } = useTranslation();

  const handleChangeDateRagePicker = React.useCallback(
    (({ formattedDates: formattedDate }) => {
      navigate(
        `${getInspectorPath(application!)}?${convertParamsToQueryString({
          ...formattedDate,
          ...{ agentId, version },
        })}`,
      );
    }) as DatetimePickerChangeHandler,
    [application?.applicationName, agentId],
  );

  return (
    <div className="flex flex-col flex-1 h-full">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <FaChartLine /> Inspector
          </div>
        }
      >
        <ApplicationCombinedList
          open={!application}
          selectedApplication={application}
          onClickApplication={(application) => navigate(getInspectorPath(application, { version }))}
        />
        {application && (
          <div className="flex items-center gap-1 ml-4 text-sm font-semibold truncate">
            <div className="truncate">({agentId ? agentId : 'all'})</div>
          </div>
        )}
        <div className="ml-auto">
          {application && (
            <DatetimePicker
              from={searchParameters.from}
              to={searchParameters.to}
              onChange={handleChangeDateRagePicker}
              maxDateRangeDays={28}
              outOfDateRangeMessage={t('DATE_RANGE_PICKER.MAX_SEARCH_PERIOD', {
                maxSearchPeriod: 28,
              })}
              timeUnits={['5m', '20m', '1h', '12h', '1d', '7d', '14d', '28d']}
            />
          )}
        </div>
      </MainHeader>
      {application && (
        <LayoutWithContentSidebar contentWrapperClassName="h-fit">
          <InspectorSidebar />
          {agentId ? (
            <div className="space-y-3">
              <InspectorAgentStatusTimeline />
              <InspectorAgentInfo />
              <InspectorAgentChartList emptyMessage={t('COMMON.NO_DATA')} />
            </div>
          ) : (
            <div className="space-y-3">
              <InspectorApplicationStatusTimeline />
              <InspectorApplicationChartList emptyMessage={t('COMMON.NO_DATA')} />
            </div>
          )}
        </LayoutWithContentSidebar>
      )}
    </div>
  );
};
